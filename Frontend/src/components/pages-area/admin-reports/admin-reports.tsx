
import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { reportService, VacationReport } from "../../../services/report-service";
import "./admin-reports.css";

export function AdminReports() {

    const [report, setReport] = useState<VacationReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load report:
    useEffect(() => {
        reportService.getVacationsReport()
            .then(result => setReport(result))
            .catch(err => {
                setError(
                    axios.isAxiosError(err)
                        ? err.response?.data?.message ?? "Failed to load report."
                        : "Failed to load report."
                );
            })
            .finally(() => setLoading(false));
    }, []);

    const totalLikes = report.reduce(
        (sum, vacation) => sum + vacation.likesCount,
        0
    );

    return (
        <div className="AdminReports">

            <h2>Vacations Likes Report</h2>

            {loading && <p>Loading report...</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && (
                <>
                    <p>Total Likes: {totalLikes}</p>

                    <button
                        className="download-report-button"
                        onClick={() => reportService.downloadCsv(report)}
                        disabled={report.length === 0}
                    >
                        Download CSV
                    </button>

                    {report.length > 0 ? (
                        <div className="report-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={report}
                                    margin={{ top: 20, right: 30, left: 10, bottom: 75 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="destination"
                                        angle={-40}
                                        textAnchor="end"
                                        height={90}
                                        interval={0}
                                        tick={{ fontSize: 11 }}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="likesCount"
                                        name="Likes"
                                        fill="#2563eb"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p>No vacations available.</p>
                    )}
                </>
            )}

        </div>
    );
}
