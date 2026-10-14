
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpRegister } from "./mcp-register";

class VacationsMcpServer {

    // Create MCP server:
    public create(): McpServer {

        const mcpServer = new McpServer({
            name: "vacations-mcp-server",
            version: "1.0.0"
        });

        // Register tools:
        mcpRegister.registerGetAllVacationsTool(mcpServer);
        mcpRegister.registerGetVacationStatisticsTool(mcpServer);
        mcpRegister.registerGetFutureVacationsTool(mcpServer);

        return mcpServer;
    }
}

export const vacationsMcpServer = new VacationsMcpServer();
