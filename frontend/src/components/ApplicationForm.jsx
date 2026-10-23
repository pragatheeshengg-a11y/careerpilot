import { useEffect, useState } from "react";

const emptyForm = {
  company: "",
  jobTitle: "",
  location: "",
  jobUrl: "",
  status: "Applied",
  appliedDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

function ApplicationForm({
  initialData,
  onSave,
  onCancel,
  saving,
}) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        company: initialData.company || "",
        jobTitle: initialData.jobTitle || "",
        location: initialData.location || "",
        jobUrl: initialData.jobUrl || "",
        status: initialData.status || "Applied",
        appliedDate: initialData.appliedDate
          ? new Date(initialData.appliedDate).toISOString().slice(0, 10)
          : emptyForm.appliedDate,
        notes: initialData.notes || "",
      });
    } else {
      setForm({
        ...emptyForm,
        appliedDate: new Date().toISOString().slice(0, 10),
      });
    }

    setError("");
  }, [initialData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await onSave(form);
    } catch (err) {
      setError(err.message || "Unable to save application");
    }
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <span className="eyebrow">
            {initialData ? "EDIT RECORD" : "NEW OPPORTUNITY"}
          </span>
          <h2>
            {initialData ? "Update application" : "Add an application"}
          </h2>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Company *
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="e.g. Zoho"
            maxLength={100}
            required
          />
        </label>

        <label>
          Job title *
          <input
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            placeholder="e.g. Junior MERN Developer"
            maxLength={120}
            required
          />
        </label>

        <label>
          Location
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Chennai / Remote"
            maxLength={120}
          />
        </label>

        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Wishlist</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </label>

        <label>
          Application date
          <input
            name="appliedDate"
            type="date"
            value={form.appliedDate}
            onChange={handleChange}
          />
        </label>

        <label>
          Job posting URL
          <input
            name="jobUrl"
            type="url"
            value={form.jobUrl}
            onChange={handleChange}
            placeholder="https://example.com/job"
            maxLength={2048}
          />
        </label>

        <label className="full-width">
          Notes
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Recruiter details, required skills, next steps..."
            maxLength={3000}
            rows={3}
          />
        </label>
      </div>

      {error && <p className="message">{error}</p>}

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="button button-outline"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}

        <button className="button button-primary" type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : initialData
              ? "Save changes"
              : "Add application"}
        </button>
      </div>
    </form>
  );
}

export default ApplicationForm;