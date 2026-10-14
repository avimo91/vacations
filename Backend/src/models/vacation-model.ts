
import z from "zod";
import { UploadedFile } from "express-fileupload";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Vacation schema:
const VacationSchema = z.object({
    vacationId: z.number().int().positive().optional(),
    destination: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    price: z.number().min(0).max(10000),
    imageName: z.string().max(255).optional()
});

// Vacation data:
type VacationData = {
    vacationId?: number;
    destination: string;
    description: string;
    startDate: string | Date;
    endDate: string | Date;
    price: string | number;
    imageName?: string;
    image?: UploadedFile;
};

// Vacation model:
export class VacationModel {

    public vacationId?: number;
    public destination: string;
    public description: string;
    public startDate: Date;
    public endDate: Date;
    public price: number;
    public imageName: string;
    public image?: UploadedFile;

    public constructor(vacation: VacationData) {
        this.vacationId = vacation.vacationId;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = new Date(vacation.startDate);
        this.endDate = new Date(vacation.endDate);
        this.price = Number(vacation.price);
        this.imageName = vacation.imageName ?? "";
        this.image = vacation.image;
    }

    // Validate vacation fields:
    public validate(): void {
        const result = VacationSchema.safeParse(this);

        if (!result.success) {
            const issue = result.error.issues[0];
            throw new ClientError(
                StatusCode.UnprocessableContent,
                `${issue.path.join(".")}: ${issue.message}`
            );
        }

        if (this.endDate < this.startDate) {
            throw new ClientError(
                StatusCode.UnprocessableContent,
                "End date cannot be earlier than start date."
            );
        }
    }

    // Validate new vacation:
    public validateForAdd(): void {
        this.validate();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (this.startDate < today || this.endDate < today) {
            throw new ClientError(
                StatusCode.UnprocessableContent,
                "Vacation dates cannot be in the past."
            );
        }

        if (!this.image) {
            throw new ClientError(
                StatusCode.UnprocessableContent,
                "Vacation image is required."
            );
        }

        this.validateImage();
    }

    // Validate existing vacation:
    public validateForUpdate(): void {
        this.validate();

        if (!this.vacationId) {
            throw new ClientError(
                StatusCode.UnprocessableContent,
                "Vacation ID is required."
            );
        }

        if (this.image) this.validateImage();
    }

    // Validate uploaded image:
    private validateImage(): void {
        if (!this.image?.mimetype.startsWith("image/")) {
            throw new ClientError(
                StatusCode.UnprocessableContent,
                "Invalid image file."
            );
        }
    }
}
