import React from "react";

const AuthContext = React.createContext(null);

async function postJson(url, body, defaultErrorMessage) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || defaultErrorMessage);
  }

  return data;
}

async function registerAccount({ username, email, password }) {
  return postJson(
    "/api/users",
    { username, email, password },
    "Could not create account."
  );
}

async function loginAccount({ username, password }) {
  return postJson(
    "/api/sessions",
    { username, password },
    "Wrong username or password."
  );
}

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = React.useState(undefined);

  const logout = React.useCallback(() => {
    setAuthToken(undefined);
  }, []);

  const authenticate = React.useCallback((token) => {
    setAuthToken(token);
  }, []);

  const makeAuthenticatedApiRequest = React.useCallback(
    async (input, init = {}) => {
      const headers = new Headers(init.headers || {});

      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }

      return fetch(input, {
        ...init,
        headers,
      });
    },
    [authToken]
  );

  const value = React.useMemo(
    () => ({
      authToken,
      isAuthenticated: Boolean(authToken),
      authenticate,
      logout,
      loginAccount,
      registerAccount,
      makeAuthenticatedApiRequest,
    }),
    [authToken, authenticate, logout, makeAuthenticatedApiRequest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}