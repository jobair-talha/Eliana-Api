import fs from "fs";
import httpStatus from "http-status";
import path from "path";
import ApiError from "../errors/ApiError";
interface DeleteFile {
    (filePath: string): Promise<boolean>;
}

const deleteFile: DeleteFile = async (filePath: string): Promise<boolean> => {
    const paths: string = path.join(process.cwd(), filePath);
    try {
        fs.unlinkSync(paths);
        return true;
    } catch (error) {
        throw new ApiError(httpStatus.NOT_FOUND, "File not found!");
    }
};

export { deleteFile };
