
import { Navigate, Route, Routes } from "react-router-dom";
import { Data } from "../../pages-area/data/data";
import { Login } from "../../pages-area/login/login";
import { Register } from "../../pages-area/register/register";
import { AdminVacations } from "../../pages-area/admin-vacations/admin-vacations";
import { AdminReports } from "../../pages-area/admin-reports/admin-reports";
import { AiRecommendations } from "../../pages-area/ai-recommendations/ai-recommendations";
import { McpChat } from "../../pages-area/mcp-chat/mcp-chat";
import { Page404 } from "../../pages-area/page404/page404";
import { Role } from "../../../models/user-model";
import { authService } from "../../../services/auth-service";

export function Routing() {

    const user = authService.getUser();

    return (
        <Routes>

            <Route
                path="/"
                element={
                    <Navigate
                        to={user ? "/vacations" : "/login"}
                        replace
                    />
                }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/vacations"
                element={
                    user
                        ? <Data />
                        : <Navigate to="/login" replace />
                }
            />

            <Route
                path="/ai/recommendations"
                element={
                    user
                        ? <AiRecommendations />
                        : <Navigate to="/login" replace />
                }
            />

            <Route
                path="/mcp"
                element={
                    user
                        ? <McpChat />
                        : <Navigate to="/login" replace />
                }
            />

            <Route
                path="/admin/vacations"
                element={
                    !user
                        ? <Navigate to="/login" replace />
                        : user.role === Role.Admin
                            ? <AdminVacations />
                            : <Navigate to="/vacations" replace />
                }
            />

            <Route
                path="/admin/reports"
                element={
                    !user
                        ? <Navigate to="/login" replace />
                        : user.role === Role.Admin
                            ? <AdminReports />
                            : <Navigate to="/vacations" replace />
                }
            />

            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
