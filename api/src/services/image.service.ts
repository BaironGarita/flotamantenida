import fs from "node:fs/promises";
import path from "node:path";
import { uploadDir } from "../middlewares/image-config.middleware";
import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

const isSeedImage = (name: string) => /^(cpe|clv|bus|mbs|pck|vad)-\d{4}\.jpg$/.test(name);
function safeName(name: unknown): string {
  if (typeof name !== "string" || !name || name !== path.basename(name) || !/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(name)) {
    throw AppError.badRequest("El nombre de la imagen no es válido");
  }
  return name;
}
function previousName(value: string): string {
  // Compatibilidad con las rutas del seed anterior; no se usan como rutas físicas.
  return safeName(value.replace(/^uploads\/activos\//, ""));
}
export const imageService = {
  async removeNewUpload(file: Express.Multer.File | undefined) {
    if (file) await fs.unlink(path.join(uploadDir, safeName(file.filename))).catch(() => undefined);
  },
  async validateFile(file: Express.Multer.File | undefined) {
    if (!file) throw AppError.badRequest("Debe enviar una imagen en el campo image");
    const handle = await fs.open(file.path, "r");
    const bytes = Buffer.alloc(12);
    try { await handle.read(bytes, 0, 12, 0); } finally { await handle.close(); }
    const valid = file.mimetype === "image/png" ? bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
      : file.mimetype === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : bytes.toString("ascii",0,4) === "RIFF" && bytes.toString("ascii",8,12) === "WEBP";
    if (!valid) throw AppError.badRequest("El contenido del archivo no corresponde a una imagen JPG, PNG o WEBP");
    return file.filename;
  },
  async deleteImageIfExists(name: string) {
    const fileName = previousName(name);
    if (isSeedImage(fileName)) return; // Los ejemplos versionados se conservan.
    const references = await prisma.activo.count({ where: { OR: [
      { imagenUrl: fileName }, { imagenUrl: "uploads/activos/" + fileName },
    ] } });
    if (references) throw AppError.conflict("La imagen todavía está asociada a un vehículo");
    try { await fs.unlink(path.join(uploadDir, fileName)); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  },
  async uploadImage(file: Express.Multer.File | undefined, previousFileName?: unknown) {
    try {
      const fileName = await this.validateFile(file);
      if (previousFileName !== undefined && previousFileName !== "") {
        if (typeof previousFileName !== "string") throw AppError.badRequest("El nombre anterior debe ser texto");
        await this.deleteImageIfExists(previousFileName);
      }
      return { fileName, url: "/images/" + fileName };
    } catch (error) { await this.removeNewUpload(file); throw error; }
  },
  async listImages() {
    const entries = await fs.readdir(uploadDir, { withFileTypes: true });
    return entries.filter(entry => entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name))
      .map(entry => ({ fileName: entry.name, url: "/images/" + entry.name })).sort((a,b) => a.fileName.localeCompare(b.fileName));
  },
  async getImagePath(name: unknown) {
    const filePath = path.join(uploadDir, safeName(name));
    try { const stat = await fs.stat(filePath); if (!stat.isFile()) throw AppError.notFound("La imagen no existe"); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") throw AppError.notFound("La imagen no existe"); throw error; }
    return filePath;
  },
  async updateActivoImage(id: number, file: Express.Multer.File | undefined) {
    let updated;
    let previous: string | null = null;
    try {
      const fileName = await this.validateFile(file);
      const activo = await prisma.activo.findUnique({ where: { id } });
      if (!activo) throw AppError.notFound("Vehículo no encontrado");
      previous = activo.imagenUrl;
      updated = await prisma.activo.update({ where: { id }, data: { imagenUrl: fileName } });
    } catch (error) { await this.removeNewUpload(file); throw error; }
    // La imagen nueva ya está guardada: una falla al limpiar no revierte el vehículo.
    if (previous) await this.deleteImageIfExists(previous).catch(() => undefined);
    return updated;
  },
};
