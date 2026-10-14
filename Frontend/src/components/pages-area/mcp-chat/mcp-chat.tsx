
import { FormEvent, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { mcpService } from "../../../services/mcp-service";
import "./mcp-chat.css";

export function McpChat() {

    const [question, setQuestion] = useState("");
    const [askedQuestion, setAskedQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Ask database question:
    async function ask(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const text = question.trim();

        if (!text) {
            setError("Please enter a question.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setAnswer("");

            const result = await mcpService.ask(text);

            setAskedQuestion(text);
            setAnswer(result);
            setQuestion("");
        }
        catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message ?? "Failed to get answer."
                : "Failed to get answer.";

            setError(message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="McpChat">

            <h2>Ask About Our Vacations</h2>

            <p className="mcp-description">
                Ask questions about the vacations in our database.
            </p>

            <form onSubmit={ask}>
                <textarea
                    value={question}
                    onChange={event => setQuestion(event.target.value)}
                    placeholder="What is the average vacation price?"
                    maxLength={500}
                    rows={3}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Checking database..." : "Ask Question"}
                </button>
            </form>

            {loading && (
                <p className="mcp-loading">
                    Getting information from the database...
                </p>
            )}

            {error && <p className="mcp-error" role="alert">{error}</p>}

            {answer && (
                <div className="mcp-answer">
                    <h3>{askedQuestion}</h3>

                    <div className="mcp-markdown">
                        <ReactMarkdown>{answer}</ReactMarkdown>
                    </div>
                </div>
            )}

        </div>
    );
}
