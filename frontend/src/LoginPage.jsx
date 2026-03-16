import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

async function postJson(url, body, defaultErrorMessage) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    console.log("Got response", response)

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

function getCredentials(formData, isRegistering) {
    return {
        username: formData.get("username")?.toString().trim() || "",
        email: isRegistering ? formData.get("email")?.toString().trim() || "" : "",
        password: formData.get("password")?.toString() || "",
    };
}

function validateCredentials({ username, email, password }, isRegistering) {
    if (!username || !password || (isRegistering && !email)) {
        return "Please fill out all required fields.";
    }

    return null;
}

function createSubmitAction({ isRegistering, onAuthenticated, navigate }) {
    return async (_previousState, formData) => {
        const credentials = getCredentials(formData, isRegistering);
        const validationError = validateCredentials(credentials, isRegistering);

        if (validationError) {
            return validationError;
        }

        try {
            const data = isRegistering
                ? await registerAccount(credentials)
                : await loginAccount(credentials);

            const authToken = data?.token;
            console.log("got data", data)

            if (!authToken) {
                return "The server response did not include an auth token.";
            }

            if (isRegistering) {
                console.log("Successfully created account");
            }

            console.log("got auth token", authToken)

            onAuthenticated(authToken);
            navigate("/");

            return null;
        } catch (error) {
            return error instanceof Error
                ? error.message
                : "Something went wrong. Please try again.";
        }
    };
}

export function LoginPage({ isRegistering = false, onAuthenticated }) {
    const navigate = useNavigate();

    const usernameInputId = React.useId();
    const emailInputId = React.useId();
    const passwordInputId = React.useId();

    const submitActionFn = React.useMemo(
        () =>
            createSubmitAction({
                isRegistering,
                onAuthenticated,
                navigate,
            }),
        [isRegistering, onAuthenticated, navigate]
    );

    const [errorMessage, submitAction, isPending] = React.useActionState(
        submitActionFn,
        null
    );

    return (
        <>
            <h2>{isRegistering ? "Register a new account" : "Login"}</h2>

            <form className="LoginPage-form" action={submitAction}>
                <label htmlFor={usernameInputId}>Username</label>
                <input
                    id={usernameInputId}
                    name="username"
                    required
                    disabled={isPending}
                />

                {isRegistering && (
                    <>
                        <label htmlFor={emailInputId}>Email</label>
                        <input
                            id={emailInputId}
                            name="email"
                            type="email"
                            required
                            disabled={isPending}
                        />
                    </>
                )}

                <label htmlFor={passwordInputId}>Password</label>
                <input
                    id={passwordInputId}
                    name="password"
                    type="password"
                    required
                    disabled={isPending}
                />

                <input
                    type="submit"
                    value={isPending ? "Submitting..." : "Submit"}
                    disabled={isPending}
                />
            </form>

            {errorMessage && <p className="LoginPage-error">{errorMessage}</p>}

            {isRegistering ? (
                <p>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            ) : (
                <p>
                    {`Don't have an account?`}
                    <Link to="/register">Register here</Link>
                </p>
            )}
        </>
    );
}