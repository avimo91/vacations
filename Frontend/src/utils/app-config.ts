
class AppConfig {

    private readonly baseUrl = "http://localhost:4000/api";

    public readonly vacationsUrl = `${this.baseUrl}/vacations`;
    public readonly likesUrl = `${this.baseUrl}/likes`;
    public readonly registerUrl = `${this.baseUrl}/register`;
    public readonly loginUrl = `${this.baseUrl}/login`;
    public readonly imagesUrl = `${this.baseUrl}/images/`;
    public readonly reportsUrl = `${this.baseUrl}/reports/vacations`;

}

export const appConfig = new AppConfig();
