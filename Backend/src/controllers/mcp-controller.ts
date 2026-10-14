
import express, { Request, Response, Router } from "express";
import { mcpQuestionService } from "../services/mcp-question-service";
import { securityMiddleware } from "../middleware/security-middleware";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

class McpController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post(
            "/api/mcp/ask",
            securityMiddleware.verifyLoggedIn,
            this.ask
        );
    }

    // Ask MCP question:
    private async ask(
        request: Request,
        response: Response
    ): Promise<void> {

        const question = request.body?.question;

        if (
            typeof question !== "string" ||
            question.trim().length === 0 ||
            question.length > 500
        ) {
            throw new ClientError(
                StatusCode.BadRequest,
                "Question must contain 1 to 500 characters."
            );
        }

        const answer = await mcpQuestionService.ask(question.trim());

        response.json({ answer });
    }
}

export const mcpController = new McpController();
