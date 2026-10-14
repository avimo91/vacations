
import { ResultSetHeader } from "mysql2";
import { UserModel, CredentialsModel, Role } from "../models/user-model";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { dal } from "../utils/dal";
import { cyber } from "../utils/cyber";

class AuthService {

    // Register new user:
    public async register(user: UserModel): Promise<string> {

        // New users always receive the User role:
        user.role = Role.User;
        user.validate();

        // Check if email already exists:
        const existingUsers = await dal.execute(
            "SELECT userId FROM users WHERE email = ?",
            [user.email]
        ) as UserModel[];

        if (existingUsers.length > 0) {
            throw new ClientError(StatusCode.Conflict, "Email already exists.");
        }

        // Hash password:
        const passwordHash = cyber.hash(user.password);

        // Insert new user:
        const sql = "INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)";
        const values = [user.firstName, user.lastName, user.email, passwordHash, user.role];

        try {
            const result = await dal.execute(sql, values) as ResultSetHeader;
            user.userId = result.insertId;
        }
        catch (err: any) {
            if (err.code === "ER_DUP_ENTRY") {
                throw new ClientError(StatusCode.Conflict, "Email already exists.");
            }
            throw err;
        }

        // Return JWT:
        return cyber.generateToken(user);
    }

    // Login existing user:
    public async login(credentials: CredentialsModel): Promise<string> {

        credentials.validate();

        // Find user by email and hashed password:
        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        const values = [credentials.email, cyber.hash(credentials.password)];

        const users = await dal.execute(sql, values) as UserModel[];

        if (users.length === 0) {
            throw new ClientError(StatusCode.Unauthorized, "Incorrect email or password.");
        }

        // Return JWT:
        return cyber.generateToken(users[0]);
    }
}

export const authService = new AuthService();
