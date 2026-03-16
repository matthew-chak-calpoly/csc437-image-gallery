import { useEffect, useState } from "react";
import { fetchAll } from "./ImageFetcher.js";
import { ImageGrid } from "./ImageGrid.jsx";
import { useAuth } from "../AuthContext.jsx";

export function AllImages() {
  const { makeAuthenticatedApiRequest } = useAuth();

  const [imageData, setImageData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true);
        setError("");

        const images = await fetchAll(makeAuthenticatedApiRequest);
        setImageData(images);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [makeAuthenticatedApiRequest]);

  if (loading) {
    return <h2 aria-live="polite">Loading...</h2>;
  }

  return (
    <>
      <h2>All Images</h2>
      {error && <h2 aria-live="polite">{error}</h2>}
      {imageData && <ImageGrid images={imageData} />}
    </>
  );
}