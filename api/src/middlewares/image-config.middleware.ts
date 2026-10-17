import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { AppError } from "../utils/app-error";

// Funciona tanto con tsx (src) como con el código compilado (dist).
export const uploadDir = path.resolve(process.env.IMAGE_UPLOAD_DIR || path.join(__dirname, "../../assets/uploads"));
fs.mkdirSync(uploadDir, { recursive: true });
const extensions: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"],
};
export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, callback) => callback(null, "vehiculo-" + randomUUID() + path.extname(file.originalname).toLowerCase()),
  }),
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!extensions[file.mimetype]?.includes(extension)) {
      callback(AppError.badRequest("Solo se permiten imágenes JPG, PNG o WEBP con extensión y tipo coincidentes"));
      return;
    }
    callback(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024, files: 1, fields: 2, fieldSize: 500 },
}).single("image");
