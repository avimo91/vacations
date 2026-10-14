
import axios from "axios";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { vacationsMcpServer } from "../ai/mcp-server";

class McpQuestionService {

    // Ask question about database:
    public async ask(question: string): Promise<string> {

        const mcpServer = vacationsMcpServer.create();

        const mcpClient = new Client({
            name: "vacations-mcp-client",
            version: "1.0.0"
        });

        const [clientTransport, serverTransport] =
            InMemoryTransport.createLinkedPair();

        try {
            // Connect MCP client and server:
            await Promise.all([
                mcpServer.connect(serverTransport),
                mcpClient.connect(clientTransport)
            ]);

            // Call MCP tools:
            const [vacations, statistics, futureVacations] =
                await Promise.all([
                    mcpClient.callTool({
                        name: "get_all_vacations"
                    }),
                    mcpClient.callTool({
                        name: "get_vacation_statistics"
                    }),
                    mcpClient.callTool({
                        name: "get_future_vacations"
                    })
                ]);

            const systemPrompt = `
                You answer questions about a vacation database.

                Follow these rules:
                1. Use only the database information provided.
                2. Do not invent vacations, prices or dates.
                3. If information is unavailable, explain that clearly.
                4. You may use general geographical knowledge
                   to identify which destinations are in Europe.
                5. Answer the user's question clearly and concisely.
                6. Use Markdown when useful.
                7. The current date is ${new Date().toISOString().slice(0, 10)}.
            `;

            const userPrompt = `
                Database information received from MCP tools:

                All vacations:
                ${JSON.stringify(vacations.content)}

                Statistics:
                ${JSON.stringify(statistics.content)}

                Future vacations:
                ${JSON.stringify(futureVacations.content)}

                User question:
                ${question}
            `;

            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4.1-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ]
                },
                {
                    headers: {
                        authorization: "Bearer " + process.env.OPENAI_API_KEY
                    },
                    timeout: 30000
                }
            );

            return response.data.choices[0].message.content as string;
        }
        finally {
            await mcpClient.close();
            await mcpServer.close();
        }
    }
}

export const mcpQuestionService = new McpQuestionService();
