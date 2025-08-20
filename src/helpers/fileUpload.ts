import { Request } from "express";
import multer, { FileFilterCallback, StorageEngine } from "multer";

type FileUploadMiddleware = ReturnType<typeof multer>;

export const FileUpload = (
    destinationPath: string,
    allowedMimeTypes: string[]
): FileUploadMiddleware => {
    const storage: StorageEngine = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
            const extension = file.originalname.split(".");
            cb(null, `${Date.now()}.${extension[extension.length - 1]}`);
        },
    });

    const upload = multer({
        storage: storage,
        fileFilter: function (
            req: Request,
            file: Express.Multer.File,
            cb: FileFilterCallback
        ) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                cb(new Error(`Forbidden file type`));
            } else {
                cb(null, true);
            }
        },
    });

    return upload;
};
