import "../login/login.css";

import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserModel } from "../../../models/user-model";
import { authService } from "../../../services/auth-service";

export function Register() {

    const [user, setUser] = useState<UserModel>(new UserModel());
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Register:
    async function send(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await authService.register(user);
            window.location.replace("/vacations");
        }
        catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ?? "Registration failed."
                    : "Registration failed."
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
        <div className="Register">
            <h2>Register</h2>

            <form onSubmit={send}>
                <label htmlFor="first-name">First Name:</label>
                <input
                    id="first-name"
                    required
                    maxLength={50}
                    value={user.firstName}
                    onChange={event => setUser({ ...user, firstName: event.target.value })}
                />

                <label htmlFor="last-name">Last Name:</label>
                <input
                    id="last-name"
                    required
                    maxLength={50}
                    value={user.lastName}
                    onChange={event => setUser({ ...user, lastName: event.target.value })}
                />

                <label htmlFor="register-email">Email:</label>
                <input
                    id="register-email"
                    type="email"
                    required
                    value={user.email}
                    onChange={event => setUser({ ...user, email: event.target.value })}
                />

                <label htmlFor="register-password">Password:</label>
                <input
                    id="register-password"
                    type="password"
                    required
                    minLength={4}
                    value={user.password}
                    onChange={event => setUser({ ...user, password: event.target.value })}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            {error && <p role="alert">{error}</p>}

            <p>Already registered? <a href="/login">Login</a></p>
        </div>
    );
}
