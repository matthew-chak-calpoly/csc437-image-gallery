import multer from "multer";
import { getEnvVar } from "./getEnvVar.js";

class ImageFormatError extends Error {}

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, getEnvVar("IMAGE_UPLOAD_DIR"))
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.split("/")[1];
        const fileName = Date.now() + "-" + Math.round(Math.random() * 1E9) + "." + extension;
        cb(null, fileName)
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

export function handleImageFileErrors(err, req, res, next) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); // Some other error, let the next middleware handle it
}