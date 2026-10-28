const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

async function request(path, token, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function listApplications(token, search = "", status = "") {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());
  if (status) params.set("status", status);

  const query = params.toString();

  return request(
    `/api/applications${query ? `?${query}` : ""}`,
    token
  );
}

export function createApplication(token, application) {
  return request("/api/applications", token, {
    method: "POST",
    body: JSON.stringify(application),
  });
}

export function updateApplication(token, id, application) {
  return request(`/api/applications/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(application),
  });
}

export function deleteApplication(token, id) {
  return request(`/api/applications/${id}`, token, {
    method: "DELETE",
  });
}