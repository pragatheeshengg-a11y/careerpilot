import { useCallback, useEffect, useState } from "react";
import "./index.css";

import ApplicationForm from "./components/ApplicationForm.jsx";
import ApplicationList from "./components/ApplicationList.jsx";
import AIWorkspace from "./components/AIWorkspace.jsx";

import {
  listApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "./services/applicationApi.js";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const statuses = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];

function App() {
  const [mode, setMode] = useState("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [trackerMessage, setTrackerMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [savingApplication, setSavingApplication] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("careerpilot_token");

    if (!savedToken) return;

    async function loadUser() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("careerpilot_token");
          setUser(null);
          return;
        }

        setUser(data.user);
      } catch {
        setAuthMessage("Cannot connect to the backend.");
      }
    }

    loadUser();
  }, []);

  const loadApplications = useCallback(async () => {
    const token = localStorage.getItem("careerpilot_token");

    if (!token) return;

    setLoadingApplications(true);
    setTrackerMessage("");

    try {
      const data = await listApplications(token, search, status);
      setApplications(data.applications);
    } catch (error) {
      setTrackerMessage(error.message);

      if (
        error.message === "Invalid or expired token" ||
        error.message === "Authentication required"
      ) {
        localStorage.removeItem("careerpilot_token");
        setUser(null);
      }
    } finally {
      setLoadingApplications(false);
    }
  }, [search, status]);

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      loadApplications();
    }, 250);

    return () => clearTimeout(timer);
  }, [user, loadApplications]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthMessage("");
    setLoadingAuth(true);

    const endpoint = mode === "register" ? "register" : "login";

    const payload =
      mode === "register"
        ? { name, email, password }
        : { email, password };

    try {
      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthMessage(data.message || "Unable to continue.");
        return;
      }

      localStorage.setItem("careerpilot_token", data.token);
      setUser(data.user);
      setPassword("");
      setAuthMessage("");
    } catch {
      setAuthMessage("Cannot connect to the backend.");
    } finally {
      setLoadingAuth(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("careerpilot_token");
    setUser(null);
    setApplications([]);
    setSearch("");
    setStatus("");
    setShowForm(false);
    setEditingApplication(null);
    setPassword("");
    setAuthMessage("");
  }

  async function handleSaveApplication(formData) {
    const token = localStorage.getItem("careerpilot_token");

    if (!token) {
      throw new Error("Please sign in again.");
    }

    setSavingApplication(true);
    setTrackerMessage("");

    try {
      const payload = {
        company: formData.company.trim(),
        jobTitle: formData.jobTitle.trim(),
        location: formData.location.trim(),
        jobUrl: formData.jobUrl.trim(),
        status: formData.status,
        appliedDate: formData.appliedDate,
        notes: formData.notes.trim(),
      };

      if (editingApplication) {
        await updateApplication(
          token,
          editingApplication._id,
          payload
        );
      } else {
        await createApplication(token, payload);
      }

      setShowForm(false);
      setEditingApplication(null);

      await loadApplications();
    } finally {
      setSavingApplication(false);
    }
  }

  function handleEdit(application) {
    setEditingApplication(application);
    setShowForm(true);
    setTrackerMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(application) {
    const confirmed = window.confirm(
      `Delete the application for ${application.jobTitle} at ${application.company}?`
    );

    if (!confirmed) return;

    const token = localStorage.getItem("careerpilot_token");

    try {
      setTrackerMessage("");

      await deleteApplication(token, application._id);
      await loadApplications();
      setTrackerMessage("Application deleted successfully.");
    } catch (error) {
      setTrackerMessage(error.message);
    }
  }

  function handleAddClick() {
    setEditingApplication(null);
    setShowForm(true);
    setTrackerMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingApplication(null);
  }

  if (user) {
    const countByStatus = (item) =>
      applications.filter((application) => application.status === item).length;

    return (
      <main className="tracker-page">
        <header className="topbar">
          <a className="brand" href="/">
            <span className="brand-icon">C</span>
            CareerPilot
          </a>

          <div className="header-user">
            <span className="header-user-name">{user.name}</span>
            <button
              type="button"
              className="button button-outline"
              onClick={() =>
                document.getElementById("ai-workspace")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              ✦ AI Assistant
            </button>
            <button
              type="button"
              className="button button-outline"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        <div className="tracker-container">
          <section className="tracker-hero">
            <div>
              <span className="eyebrow">YOUR CAREER WORKSPACE</span>
              <h1>Keep your job search moving.</h1>
              <p>
                Hi {user.name}, organize opportunities, track progress,
                and keep your next career move on course.
              </p>
            </div>

            <button
              type="button"
              className="button button-primary add-button"
              onClick={handleAddClick}
            >
              + Add application
            </button>
          </section>

          <section className="stats-grid" aria-label="Application statistics">
            <article className="stat-card">
              <span>Total shown</span>
              <strong>{applications.length}</strong>
              <small>Current search results</small>
            </article>

            <article className="stat-card">
              <span>Applied</span>
              <strong>{countByStatus("Applied")}</strong>
              <small>Applications submitted</small>
            </article>

            <article className="stat-card">
              <span>Interviews</span>
              <strong>{countByStatus("Interview")}</strong>
              <small>Interview stage</small>
            </article>

            <article className="stat-card">
              <span>Offers</span>
              <strong>{countByStatus("Offer")}</strong>
              <small>Offers received</small>
            </article>
          </section>

          {showForm && (
            <section className="form-panel tracker-form-panel">
              <ApplicationForm
                initialData={editingApplication}
                onSave={handleSaveApplication}
                onCancel={handleCancelForm}
                saving={savingApplication}
              />
            </section>
          )}

          {trackerMessage && (
            <p className="tracker-message" role="status">
              {trackerMessage}
            </p>
          )}

          <ApplicationList
            applications={applications}
            loading={loadingApplications}
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <AIWorkspace />

          <footer className="tracker-footer">
            CareerPilot · Your career journey, organized.
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="page auth-layout">
      <section className="intro-panel">
        <a className="brand" href="/">
          <span className="brand-icon">C</span>
          CareerPilot
        </a>

        <div className="intro-content">
          <span className="eyebrow">YOUR PERSONAL CAREER COMPANION</span>
          <h1>
            Make your next
            <span> career move </span>
            with confidence.
          </h1>
          <p>
            Track opportunities, prepare for interviews, and bring your
            job search into one organized workspace.
          </p>

          <ul className="benefits">
            <li><span>✓</span> Organize every application</li>
            <li><span>✓</span> Prepare smarter with AI</li>
            <li><span>✓</span> Turn job-search data into insights</li>
          </ul>
        </div>

        <p className="footer-note">
          Built with MERN, Gemini AI, and Model Context Protocol.
        </p>
      </section>

      <section className="form-panel">
        <div className="auth-card">
          <div className="mobile-brand">
            <a className="brand" href="/">
              <span className="brand-icon">C</span>
              CareerPilot
            </a>
          </div>

          <span className="eyebrow">
            {mode === "register" ? "GET STARTED" : "WELCOME BACK"}
          </span>

          <h2>
            {mode === "register"
              ? "Create your account"
              : "Sign in to CareerPilot"}
          </h2>

          <p className="form-description">
            {mode === "register"
              ? "Start organizing your career journey today."
              : "Pick up where you left off."}
          </p>

          <div className="mode-switch">
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => {
                setMode("register");
                setAuthMessage("");
              }}
            >
              Create account
            </button>

            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setAuthMessage("");
              }}
            >
              Sign in
            </button>
          </div>

          <form onSubmit={handleAuthSubmit}>
            {mode === "register" && (
              <label>
                Full name
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={2}
                  maxLength={60}
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={254}
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={mode === "register" ? 8 : 1}
                maxLength={72}
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                required
              />
            </label>

            {authMessage && (
              <p className="message" role="status">{authMessage}</p>
            )}

            <button
              className="button button-primary submit-button"
              type="submit"
              disabled={loadingAuth}
            >
              {loadingAuth
                ? "Please wait..."
                : mode === "register"
                  ? "Create account"
                  : "Sign in"}
              {!loadingAuth && <span aria-hidden="true"> →</span>}
            </button>
          </form>

          <p className="privacy-note">
            Your password is hashed before it is saved. Never reuse
            a sensitive password for a development project.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;