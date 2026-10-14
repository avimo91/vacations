
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { appConfig } from "../utils/app-config";
import { CredentialsModel, UserModel } from "../models/user-model";

type TokenPayload = {
    user: UserModel;
    exp: number;
};

class AuthService {

    // Register:
    public async register(user: UserModel): Promise<void> {
        const response = await axios.post<string>(appConfig.registerUrl, user);
        this.saveToken(response.data);
    }

    // Login:
    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        this.saveToken(response.data);
    }

    // Save JWT:
    private saveToken(token: string): void {
        localStorage.setItem("token", token);
    }

    // Get logged-in user:
    public getUser(): UserModel | null {
        const token = localStorage.getItem("token");

        if (!token) return null;

        try {
            const payload = jwtDecode<TokenPayload>(token);

            if (payload.exp * 1000 <= Date.now()) {
                this.logout();
                return null;
            }

            return payload.user;
        }
        catch {
            this.logout();
            return null;
        }
    }

    // Check login:
    public isLoggedIn(): boolean {
        return this.getUser() !== null;
    }

    // Logout:
    public logout(): void {
        localStorage.removeItem("token");
    }
}

export const authService = new AuthService();
