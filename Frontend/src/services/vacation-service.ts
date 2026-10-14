
import axios from "axios";
import { VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";

export type VacationFilter = "all" | "liked" | "active" | "future";

export type VacationPage = {
    vacations: VacationModel[];
    totalCount: number;
};

class VacationService {

    // Get all vacations for admin:
    public async getAllVacations(): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
        return response.data;
    }

    // Get one page of vacations:
    public async getVacationsPage(
        page: number,
        size: number,
        filter: VacationFilter
    ): Promise<VacationPage> {
        const response = await axios.get<VacationPage>(
            appConfig.vacationsUrl,
            { params: { page, size, filter } }
        );
        return response.data;
    }

    // Get one vacation:
    public async getOneVacation(vacationId: number): Promise<VacationModel> {
        const response = await axios.get<VacationModel>(
            `${appConfig.vacationsUrl}/${vacationId}`
        );
        return response.data;
    }

    // Get current user's likes:
    public async getMyLikes(): Promise<number[]> {
        const response = await axios.get<number[]>(appConfig.likesUrl);
        return response.data;
    }

    // Add like:
    public async addLike(vacationId: number): Promise<void> {
        await axios.post(`${appConfig.likesUrl}/${vacationId}`);
    }

    // Delete like:
    public async deleteLike(vacationId: number): Promise<void> {
        await axios.delete(`${appConfig.likesUrl}/${vacationId}`);
    }

    // Add vacation:
    public async addVacation(data: FormData): Promise<VacationModel> {
        const response = await axios.post<VacationModel>(
            appConfig.vacationsUrl,
            data
        );
        return response.data;
    }

    // Update vacation:
    public async updateVacation(vacationId: number, data: FormData): Promise<VacationModel> {
        const response = await axios.put<VacationModel>(
            `${appConfig.vacationsUrl}/${vacationId}`,
            data
        );
        return response.data;
    }

    // Delete vacation:
    public async deleteVacation(vacationId: number): Promise<void> {
        await axios.delete(`${appConfig.vacationsUrl}/${vacationId}`);
    }

    // Get vacation image URL:
    public getImageUrl(imageName: string): string {
        return appConfig.imagesUrl + encodeURIComponent(imageName);
    }
}

export const vacationService = new VacationService();
