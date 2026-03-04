const BASE_URL = "/api/images";

function waitDuration(numMs) {
    return new Promise(resolve => setTimeout(resolve, numMs));
}

export async function fetchAll() {
    await waitDuration(1000);
    const response = await fetch(BASE_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch images");
    }

    return await response.json();
}

export async function fetchById(id) {
    await waitDuration(1000);
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch images");
    }

    return await response.json();
}

export async function renameImage(id, name) {
    await waitDuration(1000);

    const response = await fetch(`${BASE_URL}/${id}`, {
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
            // In case response has no JSON body (unlikely here, but safe)
        }

        throw new Error(errorMessage);
    }

    // 204 No Content
    return;
}