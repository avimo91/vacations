
import { LikeModel } from "../models/like-model";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { dal } from "../utils/dal";

class LikeService {

    // Get vacation IDs liked by a user:
    public async getLikedVacationIds(userId: number): Promise<number[]> {
        const sql = "SELECT vacationId FROM likes WHERE userId = ?";
        const likes = await dal.execute(sql, [userId]) as LikeModel[];
        return likes.map(like => like.vacationId);
    }

    // Add like:
    public async addLike(like: LikeModel): Promise<void> {
        like.validate();

        // Verify vacation exists:
        const vacations = await dal.execute(
            "SELECT vacationId FROM vacations WHERE vacationId = ?",
            [like.vacationId]
        ) as { vacationId: number }[];

        if (vacations.length === 0) {
            throw new ClientError(StatusCode.NotFound, "Vacation not found.");
        }

        // Insert like:
        try {
            await dal.execute(
                "INSERT INTO likes (userId, vacationId) VALUES (?, ?)",
                [like.userId, like.vacationId]
            );
        }
        catch (err: unknown) {
            if (typeof err === "object" && err !== null && "code" in err && err.code === "ER_DUP_ENTRY") {
                throw new ClientError(StatusCode.Conflict, "You already liked this vacation.");
            }
            throw err;
        }
    }

    // Remove like:
    public async deleteLike(like: LikeModel): Promise<void> {
        like.validate();

        const result = await dal.execute(
            "DELETE FROM likes WHERE userId = ? AND vacationId = ?",
            [like.userId, like.vacationId]
        ) as { affectedRows: number };

        if (result.affectedRows === 0) {
            throw new ClientError(StatusCode.NotFound, "Like not found.");
        }
    }
}

export const likeService = new LikeService();
