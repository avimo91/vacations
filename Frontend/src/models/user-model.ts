
export enum Role {
    User = "User",
    Admin = "Admin"
}

export class UserModel {
    public userId?: number;
    public firstName = "";
    public lastName = "";
    public email = "";
    public password = "";
    public role: Role = Role.User;
}

export class CredentialsModel {
    public email = "";
    public password = "";
}
