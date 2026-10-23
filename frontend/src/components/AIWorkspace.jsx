import { useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function AIWorkspace() {
  const [mode, setMode] = useState("match");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [analysis, setAnalysis] = useState(null);
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setAnalysis(null);
    setInterviewPrep(null);
    setLoading(true);

    const token = localStorage.getItem("careerpilot_token");

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    const endpoint =
      mode === "match"
        ? "/api/ai/analyze-match"
        : "/api/ai/interview-questions";

    const payload = {
      resumeText,
      jobDescription,
      ...(mode === "interview" ? { difficulty } : {}),
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "AI request failed.");
        return;
      }

      if (mode === "match") {
        setAnalysis(data.analysis);
      } else {
        setInterviewPrep(data.interviewPrep);
      }
    } catch {
      setError("Cannot connect to CareerPilot. Check your backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ai-workspace" id="ai-workspace">
      <div className="ai-heading">
        <div>
          <span className="eyebrow">POWERED BY GEMINI</span>
          <h2>Your AI career assistant</h2>
          <p>
            Understand your fit for a role and prepare for your next interview.
          </p>
        </div>

        <span className="ai-badge">
          <span aria-hidden="true">✦</span> Gemini AI
        </span>
      </div>

      <div className="ai-mode-switch">
        <button
          type="button"
          className={mode === "match" ? "active" : ""}
          onClick={() => {
            setMode("match");
            setError("");
            setAnalysis(null);
            setInterviewPrep(null);
          }}
        >
          Resume match
        </button>

        <button
          type="button"
          className={mode === "interview" ? "active" : ""}
          onClick={() => {
            setMode("interview");
            setError("");
            setAnalysis(null);
            setInterviewPrep(null);
          }}
        >
          Interview prep
        </button>
      </div>

      <form className="ai-form" onSubmit={handleSubmit}>
        <label>
          Resume text
          <textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste your resume text here..."
            minLength={50}
            maxLength={15000}
            rows={8}
            required
          />
          <span className="field-hint">
            {resumeText.length}/15000 characters
          </span>
        </label>

        <label>
          Job description
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job responsibilities, requirements, and skills..."
            minLength={50}
            maxLength={15000}
            rows={8}
            required
          />
          <span className="field-hint">
            {jobDescription.length}/15000 characters
          </span>
        </label>

        {mode === "interview" && (
          <label>
            Interview difficulty
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
        )}

        <p className="ai-privacy-note">
          Only paste information you are comfortable sending to the Gemini API.
          Remove personal contact details and confidential information first.
        </p>

        {error && (
          <p className="message" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="button button-primary ai-submit"
          disabled={loading}
        >
          {loading
            ? "Gemini is analyzing..."
            : mode === "match"
              ? "Analyze job match"
              : "Generate interview questions"}
          {!loading && <span aria-hidden="true"> →</span>}
        </button>
      </form>

      {analysis && (
        <section className="ai-results" aria-live="polite">
          <div className="result-header">
            <div>
              <span className="eyebrow">MATCH REPORT</span>
              <h3>Resume analysis</h3>
            </div>

            <div className="score-circle">
              <strong>{analysis.matchScore}</strong>
              <span>/100</span>
            </div>
          </div>

          <p className="result-summary">{analysis.summary}</p>

          <div className="result-grid">
            <ResultList
              title="Your strengths"
              items={analysis.strengths}
              variant="positive"
            />

            <ResultList
              title="Skills to review"
              items={analysis.missingSkills}
              variant="warning"
            />

            <ResultList
              title="Recommended next steps"
              items={analysis.recommendations}
              variant="neutral"
            />
          </div>

          <p className="result-disclaimer">
            AI-generated estimate. Verify the analysis against the actual
            job requirements and your experience.
          </p>
        </section>
      )}

      {interviewPrep && (
        <section className="ai-results" aria-live="polite">
          <span className="eyebrow">YOUR PREPARATION PLAN</span>
          <h3>Interview questions</h3>
          <p className="result-summary">{interviewPrep.roleSummary}</p>

          <div className="question-list">
            {interviewPrep.questions.map((item, index) => (
              <article className="question-card" key={`${index}-${item.question}`}>
                <div className="question-top">
                  <span className="question-number">
                    Question {index + 1}
                  </span>
                  <span className="question-category">
                    {item.category} · {item.difficulty}
                  </span>
                </div>

                <h4>{item.question}</h4>
                <p className="why-asked">
                  <strong>Why it is asked:</strong> {item.whyAsked}
                </p>

                <div className="answer-tips">
                  <strong>Answer preparation tips</strong>
                  <ul>
                    {item.answerTips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

function ResultList({ title, items, variant }) {
  return (
    <article className={`result-card result-${variant}`}>
      <h4>{title}</h4>

      {items.length === 0 ? (
        <p>No items returned.</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={`${index}-${item}`}>{item}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default AIWorkspace;