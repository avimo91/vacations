
import { ResultSetHeader } from "mysql2";
import { saver } from "smart-saver";
import { VacationModel } from "../models/vacation-model";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { dal } from "../utils/dal";

export type VacationFilter = "all" | "liked" | "active" | "future";

export type VacationPage = {
    vacations: VacationModel[];
    totalCount: number;
};

class VacationService {

    // Format date for MySQL:
    private formatDate(date: Date): string {
        return date.toISOString().slice(0, 10);
    }

    // Get all vacations for admin:
    public async getAllVacations(): Promise<VacationModel[]> {
        const sql = "SELECT * FROM vacations ORDER BY startDate ASC, vacationId ASC";
        return await dal.execute(sql) as VacationModel[];
    }

    // Get one page of filtered vacations:
    public async getVacationsPage(
        page: number,
        size: number,
        filter: VacationFilter,
        userId: number
    ): Promise<VacationPage> {

        const offset = (page - 1) * size;
        let where = "";
        const values: (string | number)[] = [];

        switch (filter) {
            case "liked":
                where = `
                    WHERE EXISTS (
                        SELECT 1 FROM likes myLikes
                        WHERE myLikes.vacationId = v.vacationId
                        AND myLikes.userId = ?
                    )
                `;
                values.push(userId);
                break;

            case "active":
                where = "WHERE v.startDate <= CURDATE() AND v.endDate >= CURDATE()";
                break;

            case "future":
                where = "WHERE v.startDate > CURDATE()";
                break;
        }

        // Count matching vacations before pagination:
        const countSql = `
            SELECT COUNT(*) AS totalCount
            FROM vacations v
            ${where}
        `;

        const countResult = await dal.execute(countSql, values) as { totalCount: number }[];
        const totalCount = countResult[0].totalCount;

        // Fetch only the requested page:
        const sql = `
            SELECT v.*,
                (
                    SELECT COUNT(*)
                    FROM likes l
                    WHERE l.vacationId = v.vacationId
                ) AS likesCount
            FROM vacations v
            ${where}
            ORDER BY v.startDate ASC, v.vacationId ASC
            LIMIT ${size} OFFSET ${offset}
        `;

        const vacations = await dal.execute(sql, values) as VacationModel[];

        return { vacations, totalCount };
    }

    // Get one vacation:
    public async getOneVacation(vacationId: number): Promise<VacationModel> {
        const sql = "SELECT * FROM vacations WHERE vacationId = ?";
        const vacations = await dal.execute(sql, [vacationId]) as VacationModel[];

        if (vacations.length === 0) {
            throw new ClientError(StatusCode.NotFound, "Vacation not found.");
        }

        return vacations[0];
    }

    // Add vacation:
    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validateForAdd();

        const imageName = await saver.save(vacation.image!);

        if (!imageName) {
            throw new Error("Failed to save vacation image.");
        }

        try {
            const sql = `
                INSERT INTO vacations
                    (destination, description, startDate, endDate, price, imageName)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const values = [
                vacation.destination,
                vacation.description,
                this.formatDate(vacation.startDate),
                this.formatDate(vacation.endDate),
                vacation.price,
                imageName
            ];

            const result = await dal.execute(sql, values) as ResultSetHeader;
            return await this.getOneVacation(result.insertId);
        }
        catch (error) {
            await saver.delete(imageName);
            throw error;
        }
    }

    // Update vacation:
    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validateForUpdate();

        const vacationId = vacation.vacationId!;
        const existingVacation = await this.getOneVacation(vacationId);
        let imageName = existingVacation.imageName;

        if (vacation.image) {
            const savedImageName = await saver.save(vacation.image);

            if (!savedImageName) {
                throw new Error("Failed to save vacation image.");
            }

            imageName = savedImageName;
        }

        try {
            const sql = `
                UPDATE vacations
                SET destination = ?, description = ?, startDate = ?,
                    endDate = ?, price = ?, imageName = ?
                WHERE vacationId = ?
            `;

            const values = [
                vacation.destination,
                vacation.description,
                this.formatDate(vacation.startDate),
                this.formatDate(vacation.endDate),
                vacation.price,
                imageName,
                vacationId
            ];

            await dal.execute(sql, values);

            if (vacation.image && existingVacation.imageName) {
                await saver.delete(existingVacation.imageName);
            }

            return await this.getOneVacation(vacationId);
        }
        catch (error) {
            if (vacation.image) {
                await saver.delete(imageName);
            }
            throw error;
        }
    }

    // Delete vacation:
    public async deleteVacation(vacationId: number): Promise<void> {
        const vacation = await this.getOneVacation(vacationId);

        await dal.execute(
            "DELETE FROM vacations WHERE vacationId = ?",
            [vacationId]
        );

        if (vacation.imageName) {
            await saver.delete(vacation.imageName);
        }
    }
}

export const vacationService = new VacationService();
