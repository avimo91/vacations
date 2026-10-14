
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpTools } from "./mcp-tools";

class McpRegister {

    // Register get all vacations tool:
    public registerGetAllVacationsTool(mcpServer: McpServer): void {

        mcpServer.registerTool(
            "get_all_vacations",
            {
                description: "Get all vacations from the database, including destinations, dates, prices and likes."
            },
            mcpTools.getAllVacationsTool
        );
    }

    // Register statistics tool:
    public registerGetVacationStatisticsTool(mcpServer: McpServer): void {

        mcpServer.registerTool(
            "get_vacation_statistics",
            {
                description: "Get vacation counts, active vacations, future vacations and price statistics."
            },
            mcpTools.getVacationStatisticsTool
        );
    }

    // Register future vacations tool:
    public registerGetFutureVacationsTool(mcpServer: McpServer): void {

        mcpServer.registerTool(
            "get_future_vacations",
            {
                description: "Get all future vacations from the database."
            },
            mcpTools.getFutureVacationsTool
        );
    }
}

export const mcpRegister = new McpRegister();
