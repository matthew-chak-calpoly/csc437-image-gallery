import { useEffect, useState } from "react";
import { MainLayout } from "../MainLayout.jsx";
import { fetchAll } from "./ImageFetcher.js";
import { ImageGrid } from "./ImageGrid.jsx";

export function AllImages(props) {
    const [imageData, setImageData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadImages() {
            try {
                setLoading(true)
                setError("")
                console.log("fetching all", props.authToken)
                setImageData(await fetchAll(props.authToken));
            } catch (e) {
                setError(e.toString());
            } finally {
                setLoading(false);
            }
        }
        loadImages()
    }, [])

    if (loading) {
        return (
            <h2 aria-live="polite">Loading...</h2>
        )
    }

    return (
        <>
            <h2>All Images</h2>
            {error && <h2 aria-live="polite">{error}</h2>}
            {imageData && <ImageGrid images={imageData} />}
        </>
    );
}
