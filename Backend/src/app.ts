
import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import path from "path";
import { saver } from "smart-saver";
import { vacationController } from "./controllers/vacation-controller";
import { authController } from "./controllers/auth-controller";
import { likeController } from "./controllers/like-controller";
import { reportController } from "./controllers/report-controller";
import { aiController } from "./controllers/ai-controller";
import { mcpController } from "./controllers/mcp-controller";
import { errorMiddleware } from "./middleware/error-middleware";
import { securityMiddleware } from "./middleware/security-middleware";
import { appConfig } from "./utils/app-config";
import { loggerMiddleware } from "./middleware/logger-middleware";

class App {

    public start(): void {

        // Configure images:
        const imagesPath = path.join(__dirname, "assets", "images");
        saver.config(imagesPath);

        // Create server:
        const server = express();

        // System middleware:
        securityMiddleware.registerRateLimit(server);
        securityMiddleware.headerProtection(server);
        server.use(cors());
        server.use(express.json());
        server.use(expressFileUpload());

        // Before controllers:
        server.use(loggerMiddleware.logToConsole);
        server.use(securityMiddleware.preventXss);

        // Serve images:
        server.use("/api/images", express.static(imagesPath));

        // Controllers:
        server.use(vacationController.router);
        server.use(authController.router);
        server.use(likeController.router);
        server.use(reportController.router);
        server.use(aiController.router);
        server.use(mcpController.router);

        // Error middleware:
        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);

        // Start server:
        server.listen(appConfig.port, () => console.log("Listening..."));
    }
}

const app = new App();
app.start();
