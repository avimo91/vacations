
import axios from "axios";

class AiService {

    // Get AI travel recommendation:
    public async getRecommendation(destination: string): Promise<string> {

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error("OpenAI API key is missing.");
        }

        const systemPrompt = `
            You are a professional travel advisor.
            Give useful travel recommendations for the destination requested by the user.
            Include major attractions, activities, local food, and practical travel tips.
            Respond in English with a clear and friendly structure.
            Do not invent exact prices or opening hours.
        `;

        const body = {
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Recommend a trip to: ${destination}` }
            ]
        };

        const options = {
            headers: {
                authorization: "Bearer " + apiKey
            },
            timeout: 30000
        };

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            body,
            options
        );

        return response.data.choices[0].message.content as string;
    }
}

export const aiService = new AiService();
