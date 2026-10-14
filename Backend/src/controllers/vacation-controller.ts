
import express, { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import jwt from "jsonwebtoken";
import { vacationService, VacationFilter } from "../services/vacation-service";
import { VacationModel } from "../models/vacation-model";
import { UserModel, Role } from "../models/user-model";
import { StatusCode } from "../models/enums";
import { ClientError } from "../models/client-error";
import { securityMiddleware } from "../middleware/security-middleware";
import { appConfig } from "../utils/app-config";

class VacationController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/vacations", securityMiddleware.verifyLoggedIn, this.getAllVacations);
        this.router.get("/api/vacations/:vacationId", securityMiddleware.verifyLoggedIn, this.getOneVacation);
        this.router.post("/api/vacations", securityMiddleware.verifyAdmin, this.addVacation);
        this.router.put("/api/vacations/:vacationId", securityMiddleware.verifyAdmin, this.updateVacation);
        this.router.delete("/api/vacations/:vacationId", securityMiddleware.verifyAdmin, this.deleteVacation);
    }

    // Get vacation ID:
    private getVacationId(request: Request): number {
        const vacationId = Number(request.params.vacationId);

        if (!Number.isInteger(vacationId) || vacationId <= 0) {
            throw new ClientError(StatusCode.BadRequest, "Invalid vacation ID.");
        }

        return vacationId;
    }

    // Get authenticated user:
    private getUser(request: Request): UserModel {
        const token = request.headers.authorization!.substring(7);
        const payload = jwt.verify(token, appConfig.jwtSecret!) as { user: UserModel };
        return payload.user;
    }

    // Get all vacations or a filtered page:
    private async getAllVacations(request: Request, response: Response): Promise<void> {
        if (request.query.page === undefined &&
            request.query.size === undefined &&
            request.query.filter === undefined) {

            const vacations = await vacationService.getAllVacations();
            response.json(vacations);
            return;
        }

        const page = Number(request.query.page);
        const size = Number(request.query.size);
        const filter = request.query.filter;

        if (!Number.isInteger(page) || page < 1 ||
            !Number.isInteger(size) || size < 1 || size > 100) {
            throw new ClientError(StatusCode.BadRequest, "Invalid page or size.");
        }

        const allowedFilters = ["all", "liked", "active", "future"];

        if (typeof filter !== "string" || !allowedFilters.includes(filter)) {
            throw new ClientError(StatusCode.BadRequest, "Invalid vacation filter.");
        }

        const user = vacationController.getUser(request);

        if (filter === "liked" && user.role === Role.Admin) {
            throw new ClientError(StatusCode.Forbidden, "Admins cannot filter by likes.");
        }

        const result = await vacationService.getVacationsPage(
            page,
            size,
            filter as VacationFilter,
            user.userId
        );

        response.json(result);
    }

    // Get one vacation:
    private async getOneVacation(request: Request, response: Response): Promise<void> {
        const vacationId = vacationController.getVacationId(request);
        const vacation = await vacationService.getOneVacation(vacationId);
        response.json(vacation);
    }

    // Add vacation:
    private async addVacation(request: Request, response: Response): Promise<void> {
        const vacation = new VacationModel({
            ...request.body,
            image: request.files?.image as UploadedFile | undefined
        });

        const addedVacation = await vacationService.addVacation(vacation);
        response.status(StatusCode.Created).json(addedVacation);
    }

    // Update vacation:
    private async updateVacation(request: Request, response: Response): Promise<void> {
        const vacationId = vacationController.getVacationId(request);

        const vacation = new VacationModel({
            ...request.body,
            vacationId,
            image: request.files?.image as UploadedFile | undefined
        });

        const updatedVacation = await vacationService.updateVacation(vacation);
        response.json(updatedVacation);
    }

    // Delete vacation:
    private async deleteVacation(request: Request, response: Response): Promise<void> {
        const vacationId = vacationController.getVacationId(request);
        await vacationService.deleteVacation(vacationId);
        response.sendStatus(StatusCode.NoContent);
    }
}

export const vacationController = new VacationController();
