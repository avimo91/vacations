
import { CallToolResult } from "@modelcontextprotocol/sdk/types";
import { dal } from "../utils/dal";

type VacationData = {
    vacationId: number;
    destination: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    likesCount: number;
};

class McpTools {

    // Get all vacations:
    public async getAllVacationsTool(): Promise<CallToolResult> {

        const sql = `
            SELECT
                v.vacationId,
                v.destination,
                v.description,
                v.startDate,
                v.endDate,
                v.price,
                COUNT(l.userId) AS likesCount
            FROM vacations v
            LEFT JOIN likes l ON v.vacationId = l.vacationId
            GROUP BY
                v.vacationId,
                v.destination,
                v.description,
                v.startDate,
                v.endDate,
                v.price
            ORDER BY v.startDate ASC
        `;

        const vacations = await dal.execute(sql) as VacationData[];

        return {
            content: [{
                type: "text",
                text: JSON.stringify(vacations)
            }]
        };
    }

    // Get vacation statistics:
    public async getVacationStatisticsTool(): Promise<CallToolResult> {

        const sql = `
            SELECT
                COUNT(*) AS totalVacations,
                SUM(
                    CASE
                        WHEN startDate <= CURDATE()
                        AND endDate >= CURDATE()
                        THEN 1 ELSE 0
                    END
                ) AS activeVacations,
                SUM(
                    CASE
                        WHEN startDate > CURDATE()
                        THEN 1 ELSE 0
                    END
                ) AS futureVacations,
                ROUND(AVG(price), 2) AS averagePrice,
                MIN(price) AS minimumPrice,
                MAX(price) AS maximumPrice
            FROM vacations
        `;

        const statistics = await dal.execute(sql);

        return {
            content: [{
                type: "text",
                text: JSON.stringify(statistics)
            }]
        };
    }

    // Get future vacations:
    public async getFutureVacationsTool(): Promise<CallToolResult> {

        const sql = `
            SELECT
                vacationId,
                destination,
                description,
                startDate,
                endDate,
                price
            FROM vacations
            WHERE startDate > CURDATE()
            ORDER BY startDate ASC
        `;

        const vacations = await dal.execute(sql);

        return {
            content: [{
                type: "text",
                text: JSON.stringify(vacations)
            }]
        };
    }
}

export const mcpTools = new McpTools();
