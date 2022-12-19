import fs from "fs";
import path from "path";

export const copyFile = (file, pathDirectory, currentDir) => {
    const filePath = path.isAbsolute(file) ? file : path.join(currentDir, file);
    const pathFinish = path.isAbsolute(pathDirectory)
        ? path.join(pathDirectory, file)
        : path.join(currentDir, pathDirectory, file);

    if (fs.existsSync(filePath)) {
        console.log(`You are currently in ${currentDir}:`);
        const readStream = fs.createReadStream(filePath);
        const writeStream = fs.createWriteStream(pathFinish);
        readStream.pipe(writeStream);
    } else {
        console.log("Operation failed");
    }
};
