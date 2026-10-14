
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { VacationModel } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import "./admin-vacations.css";

type VacationForm = {
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: string;
    image: File | null;
};

const emptyForm: VacationForm = {
    destination: "",
    description: "",
    startDate: "",
    endDate: "",
    price: "",
    image: null
};

export function AdminVacations() {

    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [form, setForm] = useState<VacationForm>({ ...emptyForm });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Get date without timezone shifting:
    function toDateInput(value: string): string {
        return new Date(value).toLocaleDateString("en-CA", {
            timeZone: "Asia/Jerusalem",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
    }

    // Load vacations:
    async function loadVacations(): Promise<void> {
        try {
            const result = await vacationService.getAllVacations();
            setVacations(result);
        }
        catch (err) {
            setError(getError(err));
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadVacations();
    }, []);

    // Extract error message:
    function getError(err: unknown): string {
        if (axios.isAxiosError(err)) {
            return err.response?.data?.message ?? "Request failed.";
        }
        return "Unexpected error.";
    }

    // Update form field:
    function updateField(name: keyof VacationForm, value: string): void {
        setForm(previous => ({ ...previous, [name]: value }));
    }

    // Start editing:
    function editVacation(vacation: VacationModel): void {
        setEditingId(vacation.vacationId);
        setForm({
            destination: vacation.destination,
            description: vacation.description,
            startDate: toDateInput(vacation.startDate),
            endDate: toDateInput(vacation.endDate),
            price: String(vacation.price),
            image: null
        });
        setError("");
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Reset form:
    function resetForm(): void {
        setEditingId(null);
        setForm({ ...emptyForm });
    }

    // Save vacation:
    async function saveVacation(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setError("");
        setMessage("");
        setSaving(true);

        try {
            const data = new FormData();
            data.append("destination", form.destination);
            data.append("description", form.description);
            data.append("startDate", form.startDate);
            data.append("endDate", form.endDate);
            data.append("price", form.price);

            if (form.image) {
                data.append("image", form.image);
            }

            if (editingId === null) {
                await vacationService.addVacation(data);
                setMessage("Vacation added successfully.");
            }
            else {
                await vacationService.updateVacation(editingId, data);
                setMessage("Vacation updated successfully.");
            }

            resetForm();
            await loadVacations();
        }
        catch (err) {
            setError(getError(err));
        }
        finally {
            setSaving(false);
        }
    }

    // Delete vacation:
    async function deleteVacation(vacation: VacationModel): Promise<void> {
        if (!window.confirm(`Delete vacation to ${vacation.destination}?`)) {
            return;
        }

        setError("");
        setMessage("");

        try {
            await vacationService.deleteVacation(vacation.vacationId);
            setMessage("Vacation deleted successfully.");

            if (editingId === vacation.vacationId) {
                resetForm();
            }

            await loadVacations();
        }
        catch (err) {
            setError(getError(err));
        }
    }

    return (
        <div className="AdminVacations">
            <h2>Manage Vacations</h2>

            <section className="admin-form-section">
                <h3>{editingId === null ? "Add Vacation" : `Edit Vacation #${editingId}`}</h3>

                <form onSubmit={saveVacation}>
                    <label htmlFor="destination">Destination:</label>
                    <input
                        id="destination"
                        value={form.destination}
                        onChange={event => updateField("destination", event.target.value)}
                        required
                        maxLength={100}
                    />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={event => updateField("description", event.target.value)}
                        required
                    />

                    <label htmlFor="start-date">Start Date:</label>
                    <input
                        id="start-date"
                        type="date"
                        value={form.startDate}
                        onChange={event => updateField("startDate", event.target.value)}
                        min={editingId === null ? new Date().toLocaleDateString("en-CA") : undefined}
                        required
                    />

                    <label htmlFor="end-date">End Date:</label>
                    <input
                        id="end-date"
                        type="date"
                        value={form.endDate}
                        onChange={event => updateField("endDate", event.target.value)}
                        min={form.startDate || undefined}
                        required
                    />

                    <label htmlFor="price">Price ($):</label>
                    <input
                        id="price"
                        type="number"
                        min={0}
                        max={10000}
                        step="0.01"
                        value={form.price}
                        onChange={event => updateField("price", event.target.value)}
                        required
                    />

                    <label htmlFor="image">
                        Image: {editingId !== null && "(optional when editing)"}
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        required={editingId === null}
                        onChange={event => setForm(previous => ({
                            ...previous,
                            image: event.target.files?.[0] ?? null
                        }))}
                    />

                    <div className="admin-form-actions">
                        <button type="submit" disabled={saving}>
                            {saving ? "Saving..." : editingId === null ? "Add Vacation" : "Save Changes"}
                        </button>

                        {editingId !== null && (
                            <button type="button" onClick={resetForm}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {error && <p className="admin-error" role="alert">{error}</p>}
            {message && <p className="admin-success" role="status">{message}</p>}

            <section>
                <h3>Existing Vacations ({vacations.length})</h3>

                {loading && <p>Loading vacations...</p>}

                <div className="admin-vacations-grid">
                    {vacations.map(vacation => (
                        <article className="admin-vacation-card" key={vacation.vacationId}>
                            <img
                                src={vacationService.getImageUrl(vacation.imageName)}
                                alt={vacation.destination}
                            />

                            <div className="admin-vacation-content">
                                <h4>{vacation.destination}</h4>
                                <p>{vacation.description}</p>
                                <p>
                                    {toDateInput(vacation.startDate)}
                                    {" → "}
                                    {toDateInput(vacation.endDate)}
                                </p>
                                <p><strong>${Number(vacation.price).toFixed(2)}</strong></p>

                                <div className="admin-card-actions">
                                    <button onClick={() => editVacation(vacation)}>
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() => deleteVacation(vacation)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
