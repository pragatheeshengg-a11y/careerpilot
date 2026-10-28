
const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const token = localStorage.getItem("careerpilot_token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export const listApplications = () =>
  request("/api/applications");

export const createApplication = (application) =>
  request("/api/applications", {
    method: "POST",
    body: JSON.stringify(application),
  });

export const updateApplication = (id, application) =>
  request(`/api/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(application),
  });

export const deleteApplication = (id) =>
  request(`/api/applications/${id}`, {
    method: "DELETE",
  });
