import fs from "fs";
import path from "path";

export const removeFile = (file, currentDir) => {
    const filePath = path.isAbsolute(file)
        ? file
        : path.join(currentDir, file);
    fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log("File deleted!");
    });
};
