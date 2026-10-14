
import express, { Request, Response, Router } from "express";
import { authService } from "../services/auth-service";
import { UserModel, CredentialsModel } from "../models/user-model";
import { StatusCode } from "../models/enums";

class AuthController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/register", this.register);
        this.router.post("/api/login", this.login);
    }

    // Register new user:
    private async register(request: Request, response: Response): Promise<void> {
        const user = new UserModel(request.body);
        const token = await authService.register(user);
        response.status(StatusCode.Created).json(token);
    }

    // Login existing user:
    private async login(request: Request, response: Response): Promise<void> {
        const credentials = new CredentialsModel(request.body);
        const token = await authService.login(credentials);
        response.json(token);
    }
}

export const authController = new AuthController();
