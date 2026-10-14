
import { UserModel, Role } from "../models/user-model";
import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "./app-config";
import crypto from "crypto";

class Cyber {

    // Hash password using HMAC SHA-512:
    public hash(plainText: string): string {
        return crypto.createHmac("sha512", appConfig.hashSalt).update(plainText).digest("hex");
    }

    // Generate JWT without exposing the password:
    public generateToken(user: UserModel): string {

        const { password, ...safeUser } = user;
        const payload = { user: safeUser };
        const options: SignOptions = { expiresIn: "3h" };

        return jwt.sign(payload, appConfig.jwtSecret!, options);
    }

    // Verify JWT:
    public verifyToken(token: string): boolean {

        try {
            if (!token) return false;

            jwt.verify(token, appConfig.jwtSecret!);
            return true;
        }
        catch {
            return false;
        }
    }

    // Verify JWT and admin role:
    public verifyAdmin(token: string): boolean {

        try {
            if (!token) return false;

            const payload = jwt.verify(token, appConfig.jwtSecret!) as { user: UserModel };

            return payload.user.role === Role.Admin;
        }
        catch {
            return false;
        }
    }
}

export const cyber = new Cyber();
