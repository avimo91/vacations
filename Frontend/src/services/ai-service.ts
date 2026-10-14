
import axios from "axios";

class AiService {

    // Get travel recommendation from backend:
    public async getRecommendation(destination: string): Promise<string> {

        const response = await axios.post<{ recommendation: string }>(
            "http://localhost:4000/api/ai/recommendation",
            { destination }
        );

        return response.data.recommendation;
    }
}

export const aiService = new AiService();
