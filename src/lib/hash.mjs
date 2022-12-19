import path from "path";
import fs from "fs";
import crypto from "crypto";

export const hash = (file, currentDir) => {
    const filePath = path.isAbsolute(file)
        ? file
        : path.join(currentDir, file);
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, (err, data) => {
            if (err) throw new Error("FS operation failed");
            const hash = crypto.createHash("sha256").update(data).digest("hex");
            console.log(hash);
        });
        console.log(`You are currently in ${currentDir}:`);
    } else {
        console.log("Operation failed");
    }
};
