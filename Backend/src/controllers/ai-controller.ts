
import express, { Request, Response, Router } from "express";
import { aiService } from "../services/ai-service";
import { securityMiddleware } from "../middleware/security-middleware";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

class AiController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post(
            "/api/ai/recommendation",
            securityMiddleware.verifyLoggedIn,
            this.getRecommendation
        );
    }

    // Get travel recommendation:
    private async getRecommendation(
        request: Request,
        response: Response
    ): Promise<void> {

        const destination = request.body?.destination;

        if (
            typeof destination !== "string" ||
            destination.trim().length === 0 ||
            destination.length > 100
        ) {
            throw new ClientError(
                StatusCode.BadRequest,
                "Destination must contain 1 to 100 characters."
            );
        }

        const recommendation = await aiService.getRecommendation(
            destination.trim()
        );

        response.json({ recommendation });
    }
}

export const aiController = new AiController();
