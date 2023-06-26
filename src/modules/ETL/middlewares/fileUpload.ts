import { Request } from "express";
import multer, { FileFilterCallback, Multer, StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "csv-upload/");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedFileTypes = /\.(csv)$/;
  if (!file.originalname.match(allowedFileTypes)) {
    cb(new Error("Only CSV files are allowed!"));
  } else {
    cb(null, true);
  }
};

const fileUpload: Multer = multer({ storage, fileFilter });
export default fileUpload;
