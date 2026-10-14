
import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { likeService } from "../services/like-service";
import { LikeModel } from "../models/like-model";
import { UserModel } from "../models/user-model";
import { StatusCode } from "../models/enums";
import { securityMiddleware } from "../middleware/security-middleware";
import { appConfig } from "../utils/app-config";

class LikeController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/likes", securityMiddleware.verifyRegularUser, this.getMyLikes);
        this.router.post("/api/likes/:vacationId", securityMiddleware.verifyRegularUser, this.addLike);
        this.router.delete("/api/likes/:vacationId", securityMiddleware.verifyRegularUser, this.deleteLike);
    }

    // Extract authenticated user ID:
    private getUserId(request: Request): number {
        const token = request.headers.authorization!.substring(7);
        const payload = jwt.verify(token, appConfig.jwtSecret!) as { user: UserModel };
        return payload.user.userId;
    }

    // Get current user's liked vacations:
    private async getMyLikes(request: Request, response: Response): Promise<void> {
        const userId = likeController.getUserId(request);
        const vacationIds = await likeService.getLikedVacationIds(userId);
        response.json(vacationIds);
    }

    // Add like to vacation:
    private async addLike(request: Request, response: Response): Promise<void> {
        const userId = likeController.getUserId(request);
        const vacationId = Number(request.params.vacationId);

        const like = new LikeModel({ userId, vacationId });
        await likeService.addLike(like);

        response.status(StatusCode.Created).json(like);
    }

    // Remove like from vacation:
    private async deleteLike(request: Request, response: Response): Promise<void> {
        const userId = likeController.getUserId(request);
        const vacationId = Number(request.params.vacationId);

        const like = new LikeModel({ userId, vacationId });
        await likeService.deleteLike(like);

        response.sendStatus(StatusCode.NoContent);
    }
}

export const likeController = new LikeController();
