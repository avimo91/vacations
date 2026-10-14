
import { FormEvent, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { aiService } from "../../../services/ai-service";
import "./ai-recommendations.css";

export function AiRecommendations() {

    const [destination, setDestination] = useState("");
    const [requestedDestination, setRequestedDestination] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Send destination to AI:
    async function send(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (!destination.trim()) {
            setError("Please enter a destination.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setRecommendation("");

            const selectedDestination = destination.trim();
            const result = await aiService.getRecommendation(selectedDestination);

            setRequestedDestination(selectedDestination);
            setRecommendation(result);
        }
        catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message ?? "Failed to get recommendation."
                : "Failed to get recommendation.";

            setError(message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="AiRecommendations">

            <h2>AI Travel Recommendations</h2>

            <p className="ai-description">
                Discover attractions, activities, local food and useful travel tips.
            </p>

            <form onSubmit={send}>
                <input
                    type="text"
                    placeholder="Enter destination..."
                    value={destination}
                    onChange={event => setDestination(event.target.value)}
                    maxLength={100}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Getting recommendation..." : "Get Recommendation"}
                </button>
            </form>

            {loading && (
                <p className="ai-loading">
                    Preparing your travel recommendation...
                </p>
            )}

            {error && <p className="ai-error" role="alert">{error}</p>}

            {recommendation && (
                <div className="ai-answer">
                    <h3>Recommendation for {requestedDestination}</h3>

                    <div className="ai-markdown">
                        <ReactMarkdown>{recommendation}</ReactMarkdown>
                    </div>
                </div>
            )}

        </div>
    );
}
