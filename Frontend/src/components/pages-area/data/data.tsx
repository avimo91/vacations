
import { useEffect, useState } from "react";
import axios from "axios";
import { VacationModel } from "../../../models/vacation-model";
import { Role } from "../../../models/user-model";
import { authService } from "../../../services/auth-service";
import { vacationService, VacationFilter } from "../../../services/vacation-service";
import "./data.css";

export function Data() {

    const user = authService.getUser();
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [likedIds, setLikedIds] = useState<number[]>([]);
    const [filter, setFilter] = useState<VacationFilter>("all");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [pendingLikeId, setPendingLikeId] = useState<number | null>(null);

    const pageSize = 9;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // Load only the current page:
    useEffect(() => {
        let cancelled = false;

        async function load(): Promise<void> {
            setLoading(true);
            setError("");

            try {
                const result = await vacationService.getVacationsPage(
                    page,
                    pageSize,
                    filter
                );

                let likes: number[] = [];

                if (user?.role === Role.User) {
                    likes = await vacationService.getMyLikes();
                }

                if (cancelled) return;

                setVacations(result.vacations);
                setTotalCount(result.totalCount);
                setLikedIds(likes);

                const lastPage = Math.max(
                    1,
                    Math.ceil(result.totalCount / pageSize)
                );

                if (page > lastPage) {
                    setPage(lastPage);
                }
            }
            catch (err) {
                if (cancelled) return;

                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    authService.logout();
                    window.location.replace("/login");
                    return;
                }

                setError(
                    axios.isAxiosError(err)
                        ? err.response?.data?.message ?? "Failed to load vacations."
                        : "Failed to load vacations."
                );
            }
            finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [page, filter, user?.role]);

    // Toggle like without reloading all vacations:
    async function toggleLike(vacationId: number): Promise<void> {
        if (pendingLikeId !== null) return;

        const wasLiked = likedIds.includes(vacationId);

        setPendingLikeId(vacationId);
        setError("");

        try {
            if (wasLiked) {
                await vacationService.deleteLike(vacationId);
            }
            else {
                await vacationService.addLike(vacationId);
            }

            // Update the current user's likes locally:
            setLikedIds(previous =>
                wasLiked
                    ? previous.filter(id => id !== vacationId)
                    : [...previous, vacationId]
            );

            // Update the like count on the relevant vacation:
            setVacations(previous =>
                previous.map(vacation =>
                    vacation.vacationId === vacationId
                        ? {
                            ...vacation,
                            likesCount: Number(vacation.likesCount) + (wasLiked ? -1 : 1)
                        }
                        : vacation
                )
            );

            // In My Likes, remove an unliked vacation from the list:
            if (filter === "liked" && wasLiked) {
                setVacations(previous =>
                    previous.filter(vacation => vacation.vacationId !== vacationId)
                );
                setTotalCount(previous => Math.max(0, previous - 1));
            }
        }
        catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ?? "Failed to update like."
                    : "Failed to update like."
            );
        }
        finally {
            setPendingLikeId(null);
        }
    }

    // Change filter:
    function changeFilter(nextFilter: VacationFilter): void {
        setFilter(nextFilter);
        setPage(1);
    }

    // Format date:
    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString("en-GB", {
            timeZone: "UTC"
        });
    }

    return (
        <div className="Data">
            <h2>Our Vacations</h2>

            <div className="vacation-filters">
                <button
                    onClick={() => changeFilter("all")}
                    aria-pressed={filter === "all"}
                >
                    All Vacations
                </button>

                {user?.role === Role.User && (
                    <button
                        onClick={() => changeFilter("liked")}
                        aria-pressed={filter === "liked"}
                    >
                        My Likes
                    </button>
                )}

                <button
                    onClick={() => changeFilter("active")}
                    aria-pressed={filter === "active"}
                >
                    Active
                </button>

                <button
                    onClick={() => changeFilter("future")}
                    aria-pressed={filter === "future"}
                >
                    Future
                </button>
            </div>

            {loading && <p>Loading vacations...</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && (
                <>
                    <p>{totalCount} vacations found</p>

                    <div className="vacations-grid">
                        {vacations.map(vacation => (
                            <article
                                className="vacation-card"
                                key={vacation.vacationId}
                            >
                                <img
                                    src={vacationService.getImageUrl(vacation.imageName)}
                                    alt={vacation.destination}
                                />

                                <div className="vacation-card-content">
                                    <h3>{vacation.destination}</h3>
                                    <p>{vacation.description}</p>

                                    <p>
                                        <strong>From:</strong>{" "}
                                        {formatDate(vacation.startDate)}
                                    </p>

                                    <p>
                                        <strong>To:</strong>{" "}
                                        {formatDate(vacation.endDate)}
                                    </p>

                                    <p>
                                        <strong>Price:</strong>{" "}
                                        ${Number(vacation.price).toFixed(2)}
                                    </p>

                                    <p>
                                        <strong>Likes:</strong>{" "}
                                        {vacation.likesCount}
                                    </p>

                                    {user?.role === Role.User && (
                                        <button
                                            className="like-button"
                                            disabled={pendingLikeId !== null}
                                            onClick={() => toggleLike(vacation.vacationId)}
                                        >
                                            {likedIds.includes(vacation.vacationId)
                                                ? "♥ Unlike"
                                                : "♡ Like"}
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>

                    {vacations.length === 0 && (
                        <p>No vacations match this filter.</p>
                    )}

                    {totalPages > 1 && (
                        <div className="vacation-pagination">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(previous => previous - 1)}
                            >
                                Previous
                            </button>

                            <span>Page {page} of {totalPages}</span>

                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(previous => previous + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
