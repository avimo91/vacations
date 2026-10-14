
import { dal } from "../utils/dal";

// Vacation report model:
export interface VacationReport {
    destination: string;
    likesCount: number;
}

class ReportService {

    // Get likes count for each vacation:
    public async getVacationsReport(): Promise<VacationReport[]> {
        const sql = `
            SELECT
                v.destination,
                COUNT(l.userId) AS likesCount
            FROM vacations v
            LEFT JOIN likes l ON v.vacationId = l.vacationId
            GROUP BY v.vacationId, v.destination
            ORDER BY v.destination ASC
        `;

        const result = await dal.execute(sql) as VacationReport[];

        return result.map(row => ({
            destination: row.destination,
            likesCount: Number(row.likesCount)
        }));
    }
}

export const reportService = new ReportService();
