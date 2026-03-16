import React, { useActionState, useId, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const imgInputId = useId();
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const { makeAuthenticatedApiRequest } = useAuth();
  const navigate = useNavigate();

  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      setImageDataUrl(null);
      return;
    }

    try {
      const dataUrl = await readAsDataURL(file);
      setImageDataUrl(dataUrl);
    } catch (err) {
      console.error("Failed to read file", err);
      setImageDataUrl(null);
    }
  }

  async function submitAction(_prevState, formData) {
    try {
      const res = await makeAuthenticatedApiRequest("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let message = `Request failed: ${res.status} ${res.statusText}`;

        try {
          const text = await res.text();
          if (text) {
            message = text;
          }
        } catch {
            // do nothing
        }

        setImageDataUrl(null);

        return {
          error: message,
        };
      } else {
        const data = await res.json();
        if (!data.newId) {
          return {
            error: "Failed to get image path when uploading image"
          }
        }
        navigate(`/images/${data.newId}`)
      }
    } catch (err) {
      setImageDataUrl(null);

      return {
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  const [state, formAction, isPending] = useActionState(submitAction, {
    error: null,
  });

  return (
    <form action={formAction}>
      <div>
        <label htmlFor={imgInputId}>Choose image to upload: </label>
        <input
          name="image"
          type="file"
          accept=".png,.jpg,.jpeg"
          required
          id={imgInputId}
          disabled={isPending}
          onChange={handleFileChange}
        />
      </div>

      <div>
        <label>
          <span>Image title: </span>
          <input name="name" required disabled={isPending} />
        </label>
      </div>

      {state.error && <div>{state.error}</div>}

      <div>
        {imageDataUrl && (
          <img
            style={{ width: "20em", maxWidth: "100%" }}
            src={imageDataUrl}
            alt=""
          />
        )}
      </div>

      <input type="submit" value="Confirm upload" disabled={isPending} />
    </form>
  );
}