import fs from "fs";
import path from "path";
import stream from "stream";

export const moveFile = (file, pathDirectory, currentDir) => {
    const filePath = path.isAbsolute(file)
        ? file
        : path.join(currentDir, file);
    let pathFinish = path.isAbsolute(pathDirectory)
        ? path.join(pathDirectory, file)
        : path.join(currentDir, pathDirectory, file);

    if (fs.existsSync(filePath)) {
        console.log(`You are currently in ${currentDir}:`);
        const readStream = fs.createReadStream(filePath);
        const writeStream = fs.createWriteStream(pathFinish);
        stream.pipeline(readStream, writeStream, (err) => {
            if (err) {
                console.error("Pipeline failed.", err);
            } else {
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                });
            }
        });
    } else {
        console.log("Operation failed");
    }
};
