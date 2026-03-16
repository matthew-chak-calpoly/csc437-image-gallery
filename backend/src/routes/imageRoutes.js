import express from "express";

const MAX_NAME_LENGTH = 100

export function registerImageRoutes(app, imageProvider) {
    const router = express.Router();

    // GET /api/images
    router.get("/", async (req, res) => {
        try {
            const images = await imageProvider.getAllImages();
            res.json(images);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch images" });
        }
    });

    // GET /api/images/:imageId
    router.get("/:imageId", async (req, res) => {
        try {
            const { imageId } = req.params;

            if (!imageId) {
                return res.status(400).json({error: "imageId is required"})
            }
            
            const image = await imageProvider.getImageById(imageId);

            if (!image) {
                return res.status(404).json({ error: "Image not found" });
            }

            res.json(image);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch image" });
        }
    });

    // PATCH /api/images/:imageId (rename image)
    router.patch("/:imageId", async (req, res) => {
        try {
            const { imageId } = req.params;
            const { name } = req.body;
            const username = req.userInfo.username;

            if (!imageId) {
            return res.status(400).send({
                error: "Bad Request",
                message: "imageId is required"
            });
            }

            if (typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).send({
                error: "Bad Request",
                message: "A valid image name is required"
            });
            }

            if (name.length > MAX_NAME_LENGTH) {
            return res.status(413).send({
                error: "Content Too Large",
                message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
            });
            }

            const renamed = await imageProvider.renameImage(imageId, name, username);

            if (!renamed) {
            return res.status(404).send({
                error: "Not Found",
                message: "Image not found or you are not the owner"
            });
            }

            return res.status(204).send();

        } catch (err) {
            console.error(err);
            return res.status(400).send({
            error: "Bad Request",
            message: "Invalid request format"
            });
        }
    });

    app.use("/api/images", router);
}