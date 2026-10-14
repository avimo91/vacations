
import { Express, NextFunction, Request, Response } from "express";
import expressRateLimit from "express-rate-limit";
import helmet from "helmet";
import striptags from "striptags";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { cyber } from "../utils/cyber";

class SecurityMiddleware {

    // Extract Bearer token:
    private getToken(request: Request): string {
        const authorization = request.headers.authorization;
        return authorization?.startsWith("Bearer ") ? authorization.substring(7) : "";
    }

    // Verify logged-in user:
    public verifyLoggedIn(request: Request, response: Response, next: NextFunction): void {
        const token = securityMiddleware.getToken(request);

        if (cyber.verifyToken(token)) {
            next();
        }
        else {
            next(new ClientError(StatusCode.Unauthorized, "You are not logged in."));
        }
    }

    // Verify regular user:
    public verifyRegularUser(request: Request, response: Response, next: NextFunction): void {
        const token = securityMiddleware.getToken(request);

        if (!cyber.verifyToken(token)) {
            next(new ClientError(StatusCode.Unauthorized, "You are not logged in."));
            return;
        }

        if (cyber.verifyAdmin(token)) {
            next(new ClientError(StatusCode.Forbidden, "Admins cannot perform this action."));
            return;
        }

        next();
    }

    // Verify admin:
    public verifyAdmin(request: Request, response: Response, next: NextFunction): void {
        const token = securityMiddleware.getToken(request);

        if (!cyber.verifyToken(token)) {
            next(new ClientError(StatusCode.Unauthorized, "You are not logged in."));
            return;
        }

        if (cyber.verifyAdmin(token)) {
            next();
        }
        else {
            next(new ClientError(StatusCode.Forbidden, "You are not authorized."));
        }
    }

    // Prevent XSS:
    public preventXss(request: Request, response: Response, next: NextFunction): void {
        for (const prop in request.body) {
            const value = request.body[prop];

            if (typeof value === "string") {
                request.body[prop] = striptags(value);
            }
        }

        next();
    }

    // Limit API requests without blocking static images:
    public registerRateLimit(server: Express): void {
        server.use(expressRateLimit({
            windowMs: 60 * 1000,
            limit: 120,
            standardHeaders: "draft-7",
            legacyHeaders: false,
            skip: (request: Request) => request.path.startsWith("/api/images/")
        }));
    }

    // Protect HTTP headers:
    public headerProtection(server: Express): void {
        server.use(helmet({
            crossOriginResourcePolicy: { policy: "same-site" }
        }));
    }
}

export const securityMiddleware = new SecurityMiddleware();
