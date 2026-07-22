const NVIDIA_API_KEY = "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";
const PROXIED_NVIDIA_API_URL = "/nvidia-api/chat/completions";
const DIRECT_NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL_NAME = "openai/gpt-oss-120b";

export const aiService = {
  generateResponse: async (userPrompt: string, systemContext?: string): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const systemInstruction = systemContext || 
      "You are LandLens AI, an expert, friendly real estate and land verification assistant. Help users analyze land registry records, survey numbers, market prices, legal clarity, 360° virtual tours, and site visits. Keep responses helpful, warm, concise, and formatted with markdown bold highlights and bullet points.";

    const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? PROXIED_NVIDIA_API_URL : DIRECT_NVIDIA_API_URL;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          top_p: 1,
          max_tokens: 1024,
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`NVIDIA AI API HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content && content.trim()) {
        return content.trim();
      }
      throw new Error("Empty AI response content");
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
};
