import fs from "fs";
import path from "path";

export const renameFile = (file, newFile, currentDir) => {
    const filePath = path.isAbsolute(file)
        ? file
        : path.join(currentDir, file);
    const newFilePath = path.join(currentDir, newFile);

    if (fs.existsSync(filePath)) {
        console.log(`You are currently in ${currentDir}:`);
        fs.rename(filePath, newFilePath, (err) => {
            if (err) throw err;
            console.log("Rename complete!");
        });
    } else {
        console.log("Operation failed");
    }
};
