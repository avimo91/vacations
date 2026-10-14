
import express, { Request, Response, Router } from "express";
import { reportService } from "../services/report-service";
import { securityMiddleware } from "../middleware/security-middleware";

class ReportController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get(
            "/api/reports/vacations",
            securityMiddleware.verifyAdmin,
            this.getVacationsReport
        );
    }

    // Get vacations likes report:
    private async getVacationsReport(
        request: Request,
        response: Response
    ): Promise<void> {
        const report = await reportService.getVacationsReport();
        response.json(report);
    }
}

export const reportController = new ReportController();
