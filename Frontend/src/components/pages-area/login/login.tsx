import "./login.css";

import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { CredentialsModel } from "../../../models/user-model";
import { authService } from "../../../services/auth-service";

export function Login() {

    const [credentials, setCredentials] = useState<CredentialsModel>({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Login:
    async function send(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await authService.login(credentials);
            window.location.replace("/vacations");
        }
        catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ?? "Login failed."
                    : "Login failed."
            );
        }
        finally {
            setLoading(false);
        }
    }

    if (authService.isLoggedIn()) {
        return <Navigate to="/vacations" replace />;
    }

    return (
        <div className="Login">
            <h2>Login</h2>

            <form onSubmit={send}>
                <label htmlFor="login-email">Email:</label>
                <input
                    id="login-email"
                    type="email"
                    required
                    value={credentials.email}
                    onChange={event => setCredentials({
                        ...credentials,
                        email: event.target.value
                    })}
                />

                <label htmlFor="login-password">Password:</label>
                <input
                    id="login-password"
                    type="password"
                    required
                    minLength={4}
                    value={credentials.password}
                    onChange={event => setCredentials({
                        ...credentials,
                        password: event.target.value
                    })}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {error && <p role="alert">{error}</p>}

            <p>
                Don't have an account? <a href="/register">Register</a>
            </p>
        </div>
    );
}
