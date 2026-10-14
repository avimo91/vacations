
import { NavLink } from "react-router-dom";
import { Role } from "../../../models/user-model";
import { authService } from "../../../services/auth-service";
import "./menu.css";

export function Menu() {

    const user = authService.getUser();

    // Logout:
    function logout(): void {
        authService.logout();
        window.location.replace("/login");
    }

    return (
        <div className="Menu">

            {user ? (
                <>
                    <NavLink to="/vacations">
                        Vacations
                    </NavLink>

                    {user.role === Role.User && (
                        <>
                            <NavLink to="/ai/recommendations">
                                AI Recommendations
                            </NavLink>

                            <NavLink to="/mcp">
                                Ask Database (MCP)
                            </NavLink>
                        </>
                    )}

                    {user.role === Role.Admin && (
                        <>
                            <NavLink to="/admin/vacations">
                                Manage Vacations
                            </NavLink>

                            <NavLink to="/admin/reports">
                                Reports
                            </NavLink>
                        </>
                    )}

                    <span>Welcome, {user.firstName} {user.lastName}</span>

                    <button onClick={logout}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                </>
            )}

        </div>
    );
}
