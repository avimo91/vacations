
import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// User roles:
export enum Role {
    User = "User",
    Admin = "Admin"
}

// User schema:
const UserSchema = z.object({
    userId: z.number().int().positive().optional(),
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
    email: z.email().max(255),
    password: z.string().min(4),
    role: z.enum(Role)
});

// Credentials schema:
const CredentialsSchema = z.object({
    email: z.email().max(255),
    password: z.string().min(4)
});

type IUserModel = z.infer<typeof UserSchema>;
type ICredentialsModel = z.infer<typeof CredentialsSchema>;

// User model:
export class UserModel implements IUserModel {

    public userId: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public role: Role;

    public constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role ?? Role.User;
    }

    // Validate user:
    public validate(): void {
        const result = UserSchema.safeParse(this);

        if (!result.success) {
            const issue = result.error.issues[0];
            throw new ClientError(StatusCode.UnprocessableContent, `${issue.path.join(".")}: ${issue.message}`);
        }
    }
}

// Login credentials model:
export class CredentialsModel implements ICredentialsModel {

    public email: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    // Validate credentials:
    public validate(): void {
        const result = CredentialsSchema.safeParse(this);

        if (!result.success) {
            const issue = result.error.issues[0];
            throw new ClientError(StatusCode.UnprocessableContent, `${issue.path.join(".")}: ${issue.message}`);
        }
    }
}
