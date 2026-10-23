const statuses = [
  "Wishlist",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

function ApplicationList({
  applications,
  loading,
  search,
  setSearch,
  status,
  setStatus,
  onEdit,
  onDelete,
}) {
  return (
    <section className="tracker-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR OPPORTUNITIES</span>
          <h2>Job applications</h2>
        </div>

        <span className="record-count">
          {applications.length} shown
        </span>
      </div>

      <div className="filters">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search company or job title..."
          aria-label="Search applications"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by application status"
        >
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="empty-state">Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">↗</span>
          <h3>No applications found</h3>
          <p>Add your first opportunity or change your search filters.</p>
        </div>
      ) : (
        <div className="application-list">
          {applications.map((application) => (
            <article className="application-card" key={application._id}>
              <div className="application-main">
                <div className="company-avatar">
                  {application.company.charAt(0).toUpperCase()}
                </div>

                <div className="application-details">
                  <h3>{application.jobTitle}</h3>
                  <p className="company-name">{application.company}</p>

                  <div className="application-meta">
                    {application.location && (
                      <span>⌖ {application.location}</span>
                    )}

                    <span>
                      Applied:{" "}
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                  </div>

                  {application.notes && (
                    <p className="application-notes">{application.notes}</p>
                  )}

                  {application.jobUrl && (
                    <a
                      className="job-link"
                      href={application.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View job posting ↗
                    </a>
                  )}
                </div>
              </div>

              <div className="application-side">
                <span
                  className={`status-pill status-${application.status.toLowerCase()}`}
                >
                  {application.status}
                </span>

                <div className="card-actions">
                  <button
                    type="button"
                    className="small-button"
                    onClick={() => onEdit(application)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="small-button delete-button"
                    onClick={() => onDelete(application)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ApplicationList;