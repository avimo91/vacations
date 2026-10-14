
import axios from "axios";
import { appConfig } from "../utils/app-config";

// Vacation report model:
export interface VacationReport {
    destination: string;
    likesCount: number;
}

class ReportService {

    // Get vacations report:
    public async getVacationsReport(): Promise<VacationReport[]> {
        const response = await axios.get<VacationReport[]>(
            appConfig.reportsUrl
        );

        return response.data;
    }

    // Download CSV report:
    public downloadCsv(report: VacationReport[]): void {

        // Escape CSV values:
        function escapeCsv(value: string): string {
            return `"${value.replace(/"/g, '""')}"`;
        }

        const rows = [
            "Destination,Likes",
            ...report.map(row =>
                `${escapeCsv(row.destination)},${row.likesCount}`
            )
        ];

        const csv = "\uFEFF" + rows.join("\r\n");
        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "vacations-likes-report.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }
}

export const reportService = new ReportService();
