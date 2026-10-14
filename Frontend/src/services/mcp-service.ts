
import axios from "axios";

class McpService {

    // Ask question using MCP:
    public async ask(question: string): Promise<string> {

        const response = await axios.post<{ answer: string }>(
            "http://localhost:4000/api/mcp/ask",
            { question }
        );

        return response.data.answer;
    }
}

export const mcpService = new McpService();
