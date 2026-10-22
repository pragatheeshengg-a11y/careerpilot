import { useEffect, useState } from "react";
import "./index.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function App() {
  const [mode, setMode] = useState("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("careerpilot_token");

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
        setMessage("Cannot connect to the backend.");
      }
    }

    loadUser();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const endpoint =
      mode === "register" ? "register" : "login";

    const payload =
      mode === "register"
        ? { name, email, password }
        : { email, password };

    try {
      const response = await fetch(
        `${API_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      localStorage.setItem("careerpilot_token", data.token);
      setUser(data.user);
      setPassword("");
      setMessage(data.message);
    } catch {
      setMessage(
        "Cannot connect to the backend. Check whether the server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("careerpilot_token");
    setUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setMessage("You have logged out.");
  }

  if (user) {
    return (
      <main className="page">
        <header className="topbar">
          <a className="brand" href="/">
            <span className="brand-icon">C</span>
            CareerPilot
          </a>

          <button className="button button-outline" onClick={handleLogout}>
            Log out
          </button>
        </header>

        <section className="welcome-card">
          <span className="eyebrow">YOUR CAREER JOURNEY STARTS HERE</span>
          <h1>Welcome, {user.name}!</h1>
          <p>
            Your CareerPilot account is ready. In the next phases,
            you will be able to track applications, prepare for
            interviews, and work with your AI career assistant.
          </p>

          <div className="profile-row">
            <span className="avatar">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <strong>{user.name}</strong>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-icon">01</span>
              <h2>Job Tracker</h2>
              <p>Organize your job applications in one place.</p>
              <span className="coming-soon">Coming in Phase 2</span>
            </article>

            <article className="feature-card">
              <span className="feature-icon">02</span>
              <h2>Gemini AI</h2>
              <p>Explore job matching and interview preparation.</p>
              <span className="coming-soon">Coming in Phase 4</span>
            </article>

            <article className="feature-card">
              <span className="feature-icon">03</span>
              <h2>MCP Tools</h2>
              <p>Connect your career data to compatible AI clients.</p>
              <span className="coming-soon">Coming in Phase 5</span>
            </article>
          </div>

          <p className="success-note">
            <span aria-hidden="true">✓</span> Authentication is working.
          </p>
        </section>
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
            Track opportunities, prepare for interviews, and bring
            your job search into one organized workspace.
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
                setMessage("");
              }}
            >
              Create account
            </button>

            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Sign in
            </button>
          </div>

          <form onSubmit={handleSubmit}>
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
                  mode === "register"
                    ? "new-password"
                    : "current-password"
                }
                required
              />
            </label>

            {message && (
              <p className="message" role="status">
                {message}
              </p>
            )}

            <button
              className="button button-primary submit-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "register"
                  ? "Create account"
                  : "Sign in"}
              {!loading && <span aria-hidden="true"> →</span>}
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