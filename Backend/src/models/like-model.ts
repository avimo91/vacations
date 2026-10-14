
import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Like schema:
const LikeSchema = z.object({
    userId: z.number().int().positive(),
    vacationId: z.number().int().positive()
});

// Like model:
export class LikeModel {

    public userId: number;
    public vacationId: number;

    public constructor(like: Pick<LikeModel, "userId" | "vacationId">) {
        this.userId = like.userId;
        this.vacationId = like.vacationId;
    }

    // Validate like:
    public validate(): void {
        const result = LikeSchema.safeParse(this);

        if (!result.success) {
            const issue = result.error.issues[0];
            throw new ClientError(StatusCode.UnprocessableContent, `${issue.path.join(".")}: ${issue.message}`);
        }
    }
}
