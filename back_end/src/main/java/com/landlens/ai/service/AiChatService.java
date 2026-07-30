package com.landlens.ai.service;

import com.landlens.ai.model.AiConversation;
import com.landlens.ai.model.AiMessage;
import com.landlens.ai.repository.AiConversationRepository;
import com.landlens.ai.repository.AiMessageRepository;
import com.landlens.user.model.User;
import com.landlens.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;

@Service
public class AiChatService {

    private static final String CONTENT_KEY = "content";

    @Autowired
    private AiConversationRepository conversationRepository;

    @Autowired
    private AiMessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${openai.api.key}")
    private String openAiApiKey;

    @Transactional
    public AiConversation startConversation(UUID userId, String title) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AiConversation conversation = new AiConversation();
        conversation.setUser(user);
        conversation.setTitle(title != null ? title : "Chat with AI Assistant");
        conversation.setIsActive(true);

        return conversationRepository.save(conversation);
    }

    public List<AiConversation> getUserConversations(UUID userId) {
        return conversationRepository.findByUserIdAndIsActiveTrue(userId);
    }

    public List<AiMessage> getMessages(UUID conversationId) {
        return messageRepository.findByConversationIdAndIsActiveTrueOrderByTimestampAsc(conversationId);
    }

    @Transactional
    public AiMessage sendMessage(UUID conversationId, String content) {
        AiConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation thread not found"));

        // Save User Message
        AiMessage userMsg = new AiMessage();
        userMsg.setConversation(conversation);
        userMsg.setSenderRole("USER");
        userMsg.setContent(content);
        userMsg.setTimestamp(Instant.now());
        userMsg.setIsActive(true);
        messageRepository.save(userMsg);

        String aiResponseText = "";
        try {
            // Get conversation history
            List<AiMessage> history = messageRepository.findByConversationIdAndIsActiveTrueOrderByTimestampAsc(conversationId);
            
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", "meta/llama-3.1-70b-instruct");
            requestBody.put("temperature", 0.6);
            requestBody.put("max_tokens", 512);
            
            ArrayNode messagesArray = requestBody.putArray("messages");
            
            // System prompt
            ObjectNode systemMsg = messagesArray.addObject();
            systemMsg.put("role", "system");
            systemMsg.put(CONTENT_KEY, "You are LandLens AI, an expert property verification assistant in India. You help users understand property trust scores, land documents like Patta and Sale Deeds, boundary checks, and verification timelines. Keep your answers clear, concise, direct, and professional.");
            
            // Limit history to last 6 messages for high speed
            int startIdx = Math.max(0, history.size() - 6);
            for (int i = startIdx; i < history.size(); i++) {
                AiMessage msg = history.get(i);
                ObjectNode msgNode = messagesArray.addObject();
                String role = msg.getSenderRole().equalsIgnoreCase("USER") ? "user" : "assistant";
                msgNode.put("role", role);
                msgNode.set(CONTENT_KEY, msgNode.textNode(msg.getContent()));
            }

            aiResponseText = callNvidiaApi(requestBody);

            if (aiResponseText == null || aiResponseText.trim().isEmpty()) {
                aiResponseText = generateSmartFallback(content);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            aiResponseText = generateSmartFallback(content);
        } catch (Exception e) {
            aiResponseText = generateSmartFallback(content);
        }

        AiMessage aiMsg = new AiMessage();
        aiMsg.setConversation(conversation);
        aiMsg.setSenderRole("AI");
        aiMsg.setContent(aiResponseText);
        aiMsg.setTimestamp(Instant.now().plusMillis(200));
        aiMsg.setIsActive(true);
        
        return messageRepository.save(aiMsg);
    }

    private String callNvidiaApi(ObjectNode requestBody) {
        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(2))
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://integrate.api.nvidia.com/v1/chat/completions"))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .timeout(Duration.ofSeconds(2))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                return root.path("choices").path(0).path("message").path(CONTENT_KEY).asText();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            // Fall back to local smart engine if API encounters high latency
        }
        return null;
    }

    private String generateSmartFallback(String query) {
        String lower = query.toLowerCase();
        if (lower.contains("patta") || lower.contains("chitta") || lower.contains("title")) {
            return "A **Patta** is an official legal document issued by the government proving land ownership in India. LandLens cross-checks Patta records against state revenue registries to verify title authenticity, owner names, and survey numbers in real-time.";
        } else if (lower.contains("price") || lower.contains("rate") || lower.contains("cost")) {
            return "Property valuation in LandLens is estimated using local market transactions, road access factor, and agricultural/commercial zoning data. You can view individual plot pricing details directly on the property detail page.";
        } else if (lower.contains("dispute") || lower.contains("court") || lower.contains("legal") || lower.contains("verification")) {
            return "Our AI Verification Engine evaluates property documents across 4 layers:\n1. **Ownership Title Match**\n2. **Encumbrance & Legal Litigation Check**\n3. **Boundary Verification (360° LiDAR)**\n4. **Document Anti-Forgery Scan**\n\nAll verified properties display a green **Verified** badge.";
        } else {
            return "Welcome to LandLens AI Assistant! I can help you verify land documents (Patta/Chitta, Sale Deeds), check market prices, review 360° virtual tours, and understand property trust scores. What specific land query can I assist you with today?";
        }
    }
}
