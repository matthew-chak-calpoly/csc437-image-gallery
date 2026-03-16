const BASE_URL = "/api/images";

function waitDuration(numMs) {
  return new Promise((resolve) => setTimeout(resolve, numMs));
}

export async function fetchAll(makeAuthenticatedApiRequest) {
  await waitDuration(1000);

  const response = await makeAuthenticatedApiRequest(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }

  return await response.json();
}

export async function fetchById(id, makeAuthenticatedApiRequest) {
  await waitDuration(1000);

  const response = await makeAuthenticatedApiRequest(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }

  return await response.json();
}

export async function renameImage(id, name, makeAuthenticatedApiRequest) {
  await waitDuration(1000);

  const response = await makeAuthenticatedApiRequest(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    let errorMessage = "Request failed";

    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorBody.error || errorMessage;
    } catch {
      // ignore malformed or empty error responses
    }

    throw new Error(errorMessage);
  }

  return;
}