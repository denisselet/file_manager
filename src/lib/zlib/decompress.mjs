import path from "path";
import fs from "fs";
import zlib from "zlib";

export const decompressZlib = (file, fileDest, currentDir) => {
    const filePath = path.isAbsolute(file)
        ? file
        : path.join(currentDir, file);
    const fileDestPath = path.isAbsolute(fileDest)
        ? path.join(fileDest, file.substring(0, file.length - 3))
        : path.join(currentDir, fileDest, file.substring(0, file.length - 3));

    if (fs.existsSync(filePath)) {
        const brotli = zlib.createBrotliDecompress();
        const readStream = fs.createReadStream(filePath);
        const writeStream = fs.createWriteStream(fileDestPath);
        readStream.pipe(brotli).pipe(writeStream);
        console.log(`You are currently in ${currentDir}:`);
    } else {
        console.log("Operation failed");
    }
};