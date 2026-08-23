import api from './api';
import { propertyService } from './property.service';

const NVIDIA_API_KEY = "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";
const PROXIED_NVIDIA_API_URL = "/nvidia-api/chat/completions";
const MODEL_NAME = "meta/llama-3.1-8b-instruct";

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
    // 1. Primary: Call live backend serverless AI endpoint (handles NVIDIA API securely without CORS)
    try {
      const response = await api.post<any>('/api/ai/chat', {
        prompt: userPrompt,
        content: userPrompt,
        message: userPrompt,
        systemContext: systemContext || "You are LandLens AI (IBM Bob AI Citizen Assistant) for government land verification. Explain documents in clear, citizen-friendly language.",
        history: chatHistory || []
      });

      if (response.data?.content && typeof response.data.content === 'string' && response.data.content.trim()) {
        return response.data.content.trim();
      }
      if (response.data?.message && typeof response.data.message === 'string' && response.data.message.trim()) {
        return response.data.message.trim();
      }
    } catch (err) {
      console.warn("Primary /api/ai/chat endpoint failed, trying fallback handlers...", err);
    }

    // 2. Secondary: If valid backend conversationId exists
    if (conversationId && !conversationId.startsWith('local-')) {
      try {
        const backendMsg = await propertyService.sendAiMessage(conversationId, userPrompt);
        if (backendMsg && backendMsg.content && backendMsg.content.trim()) {
          return backendMsg.content.trim();
        }
      } catch (err) {
        // Continue to local dev proxy if available
      }
    }

    // 3. Tertiary: Local Vite dev proxy if running on localhost
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isLocalhost) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const recentHistory = (chatHistory || []).slice(-8);
        const messagesPayload = [
          { role: "system", content: systemContext || "You are LandLens AI Citizen Assistant." },
          ...recentHistory.map(h => ({ role: h.role, content: h.content })),
          { role: "user", content: userPrompt }
        ];

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
            temperature: 0.6,
            max_tokens: 512
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
        console.error("Localhost Vite proxy fetch error:", error);
      }
    }

    throw new Error("Unable to connect to live AI inference server.");
  }
};

