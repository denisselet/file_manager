import fs from "fs";
import path from "path";
import zlib from "zlib";

export const compressZlib = (file, fileDest, currentDir) => {
    const filePath = path.isAbsolute(file)
        ? file
        : path.join(currentDir, file);
    const fileDestPath = path.isAbsolute(fileDest)
        ? path.join(fileDest, `${file}.gz`)
        : path.join(currentDir, fileDest, `${file}.gz`);

    if (fs.existsSync(filePath)) {
        const brotli = zlib.createBrotliCompress();
        const readStream = fs.createReadStream(filePath);
        const writeStream = fs.createWriteStream(fileDestPath);
        readStream.pipe(brotli).pipe(writeStream);

        console.log(`You are currently in ${currentDir}:`);
    } else {
        console.log("Operation failed");
    }
};
