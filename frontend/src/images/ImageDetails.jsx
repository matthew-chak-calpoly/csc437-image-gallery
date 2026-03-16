import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchById } from "./ImageFetcher.js";
import { ImageNameEditor } from "./ImageNameEditor.jsx";
import { renameImage } from "./ImageFetcher.js";

export function ImageDetails(props) {
    const { imageId } = useParams();
    const [image, setImage] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function loadImage() {
        try {
            setLoading(true)
            setError("")
            const image = await fetchById(imageId, props.authToken)
            setImage(image)
        } catch (e) {
            setError(e.toString())
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadImage();
    }, [imageId]);

    async function handleRename(imageId, nameInput) {
        try {
            setLoading(true);
            await renameImage(imageId, nameInput, props.authToken);
            await loadImage();
        } catch (e) {
            setError(e.toString())
        } finally {
            setLoading(false)
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
            </>
        );
    }

    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <ImageNameEditor imageId={imageId} initialValue={image.name} onRename={handleRename} />
            {error && <h2 aria-live="polite">{error}</h2>}
            <img
                className="ImageDetails-img"
                src={image.src}
                alt={image.name}
            />
        </>
    );
}