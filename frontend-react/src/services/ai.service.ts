import { propertyService } from './property.service';

const NVIDIA_API_KEY = "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";
const PROXIED_NVIDIA_API_URL = "/nvidia-api/chat/completions";
const MODEL_NAME = "openai/gpt-oss-120b";

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export const aiService = {
  generateResponse: async (
    userPrompt: string, 
    systemContext?: string, 
    chatHistory?: ChatHistoryItem[],
    conversationId?: string | null
  ): Promise<string> => {
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // 1. Try backend server-side AI messaging if valid conversationId is present (bypasses browser CORS)
    if (conversationId && !conversationId.startsWith('local-')) {
      try {
        const backendMsg = await propertyService.sendAiMessage(conversationId, userPrompt);
        if (backendMsg && backendMsg.content && backendMsg.content.trim()) {
          return backendMsg.content.trim();
        }
      } catch (err) {
        // Backend endpoint unavailable or returned empty, proceed to fallbacks
      }
    }

    // 2. Try Vite Dev Proxy on localhost
    if (isLocalhost) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const systemInstruction = systemContext || 
        "You are LandLens AI, a warm, friendly, highly conversational real estate advisor and land verification companion. Speak naturally and warmly like a knowledgeable friend helping someone explore land, check prices, verify titles, and book site visits. Maintain context from previous chat history, keep responses concise, engaging, and formatted with markdown bold highlights and emojis.";

      const recentHistory = (chatHistory || []).slice(-10);
      const messagesPayload = [
        { role: "system", content: systemInstruction },
        ...recentHistory.map(h => ({ role: h.role, content: h.content })),
        { role: "user", content: userPrompt }
      ];

      try {
        const response = await fetch(PROXIED_NVIDIA_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${NVIDIA_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            messages: messagesPayload,
            temperature: 0.7,
            top_p: 1,
            max_tokens: 1024,
            stream: false
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content && content.trim()) {
            return content.trim();
          }
        }
      } catch (error) {
        clearTimeout(timeoutId);
      }
    }

    // Direct browser fetch to integrate.api.nvidia.com is blocked by browser CORS policy on non-localhost origins.
    // Throw cleanly so caller immediately activates local smart conversational engine without logging CORS network errors.
    throw new Error("Direct browser CORS restricted; using smart response engine");
  }
};

