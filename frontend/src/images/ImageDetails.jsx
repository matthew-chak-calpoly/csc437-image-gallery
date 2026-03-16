import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { fetchById, renameImage } from "./ImageFetcher.js";
import { ImageNameEditor } from "./ImageNameEditor.jsx";
import { useAuth } from "../AuthContext.jsx";

export function ImageDetails() {
  const { imageId } = useParams();
  const { makeAuthenticatedApiRequest } = useAuth();

  const [image, setImage] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadImage = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const image = await fetchById(imageId, makeAuthenticatedApiRequest);
      setImage(image);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setImage(undefined);
    } finally {
      setLoading(false);
    }
  }, [imageId, makeAuthenticatedApiRequest]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  async function handleRename(imageId, nameInput) {
    try {
      setLoading(true);
      setError("");

      await renameImage(imageId, nameInput, makeAuthenticatedApiRequest);
      await loadImage();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <h2 aria-live="polite">Loading...</h2>
      </>
    );
  }

  if (!image) {
    return (
      <>
        <h2>Image not found</h2>
        {error && <h2 aria-live="polite">{error}</h2>}
      </>
    );
  }

  return (
    <>
      <h2>{image.name}</h2>
      <p>By {image.author.username}</p>
      <ImageNameEditor
        imageId={imageId}
        initialValue={image.name}
        onRename={handleRename}
      />
      {error && <h2 aria-live="polite">{error}</h2>}
      <img className="ImageDetails-img" src={image.src} alt={image.name} />
    </>
  );
}