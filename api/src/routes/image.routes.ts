import { Router } from "express";
import { ImageController } from "../controllers/image.controller";
import { uploadImage } from "../middlewares/image-config.middleware";
import { asyncHandler } from "../utils/async-handler.middleware";
export class ImageRoutes {
  static get routes(): Router {
    const router = Router(); const controller = new ImageController();
    router.post("/upload", uploadImage, asyncHandler(controller.upload));
    router.get("/files", asyncHandler(controller.getListFiles));
    router.get("/download/:name", asyncHandler(controller.download));
    return router;
  }
}
