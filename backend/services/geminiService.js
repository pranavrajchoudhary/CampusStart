const axios = require("axios");

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";
        this.model = "gemini-2.5-flash-lite";
    }

    /**
     * Generate system prompt with idea context
     */

    //.dm format try
    generateSystemPrompt(idea) {
        return `You are an expert brainstormer and domain-aware assistant.

**IDEA CONTEXT:**
- Title: ${idea.title}
- Description: ${idea.description}
- Domain(s): ${idea.domain.join(", ")}
- Required Skills: ${idea.requiredSkills.join(", ")}
- Roles Needed: ${idea.rolesNeeded.join(", ")}
- Team Size: ${idea.teamSize}

**YOUR TASK:**
- Answer user queries STRICTLY in the context of this idea
- Provide actionable, structured responses
- If asked for "latest updates", provide recent trends/technologies relevant to this idea's domain
- Maintain continuity using conversation history
- Be clear about uncertainties instead of guessing

**OUTPUT FORMAT:**
- Short intro (1-2 lines)
- Main response in bullet points or sections
- Optional next steps if relevant

Stay focused on the idea. Do NOT give generic advice.`;
    }

    /**
     * Format conversation history for Gemini API
     */
    formatMessages(conversationHistory, systemPrompt, newQuery) {
        const contents = [];

        // Add system prompt as first user message
        contents.push({
            role: "user",
            parts: [{ text: systemPrompt }]
        });

        // Add acknowledgment from model
        contents.push({
            role: "model",
            parts: [{ text: "Understood. I will answer all queries strictly in the context of this idea." }]
        });

        // Add conversation history
        conversationHistory.forEach(msg => {
            contents.push({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }]
            });
        });

        // Add new query
        contents.push({
            role: "user",
            parts: [{ text: newQuery }]
        });

        return contents;
    }

    /**
     * Call Gemini API
     */
    async askGemini(idea, conversationHistory, userQuery) {
        try {
            const systemPrompt = this.generateSystemPrompt(idea);
            const contents = this.formatMessages(conversationHistory, systemPrompt, userQuery);

            const response = await axios.post(
                `${this.apiUrl}?key=${this.apiKey}`,
                {
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            // Extract text from response
            if (response.data.candidates && response.data.candidates.length > 0) {
                const candidate = response.data.candidates[0];

                // Check if response was blocked
                if (candidate.finishReason === "SAFETY") {
                    return {
                        success: false,
                        error: "Response was blocked due to safety settings"
                    };
                }

                const assistantMessage = candidate.content.parts
                    .map(part => part.text)
                    .join("\n");

                return {
                    success: true,
                    message: assistantMessage,
                    usage: response.data.usageMetadata || {}
                };
            } else {
                return {
                    success: false,
                    error: "No response generated"
                };
            }

        } catch (error) {
            console.error("Gemini API Error:", error.response?.data || error.message);

            // Handle specific error types
            if (error.response?.status === 429) {
                return {
                    success: false,
                    error: "Rate limit exceeded. Please try again later."
                };
            }

            if (error.response?.status === 403) {
                return {
                    success: false,
                    error: "Invalid API key or quota exceeded"
                };
            }

            return {
                success: false,
                error: error.response?.data?.error?.message || "AI service temporarily unavailable"
            };
        }
    }

    /**
     * Alternative method using streaming (optional)
     */
    async askGeminiStream(idea, conversationHistory, userQuery, onChunk) {
        try {
            const systemPrompt = this.generateSystemPrompt(idea);
            const contents = this.formatMessages(conversationHistory, systemPrompt, userQuery);

            const response = await axios.post(
                `${this.apiUrl.replace('generateContent', 'streamGenerateContent')}?key=${this.apiKey}&alt=sse`,
                {
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    responseType: 'stream'
                }
            );

            let fullMessage = "";

            response.data.on('data', (chunk) => {
                const chunkStr = chunk.toString();
                const lines = chunkStr.split('\n').filter(line => line.trim().startsWith('data: '));

                lines.forEach(line => {
                    try {
                        const jsonStr = line.replace('data: ', '');
                        const data = JSON.parse(jsonStr);

                        if (data.candidates && data.candidates[0].content) {
                            const text = data.candidates[0].content.parts[0].text;
                            fullMessage += text;
                            if (onChunk) onChunk(text);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                });
            });

            return new Promise((resolve, reject) => {
                response.data.on('end', () => {
                    resolve({
                        success: true,
                        message: fullMessage
                    });
                });

                response.data.on('error', (error) => {
                    reject({
                        success: false,
                        error: error.message
                    });
                });
            });

        } catch (error) {
            console.error("Gemini Stream Error:", error);
            return {
                success: false,
                error: "Streaming failed"
            };
        }
    }
}

module.exports = new GeminiService();