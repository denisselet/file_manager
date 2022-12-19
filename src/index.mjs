import readline from "readline";
import os from "os";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import zlib from "zlib";
import stream from "stream";

const homeDir = os.homedir();

const index = () => {
    let currentDir = homeDir;
    const args = process.argv.slice(2);
    const Username = args[0].split("=")[1];
    console.log(`Welcome to the File Manager, ${Username}!`);
    console.log(`You are currently in ${currentDir}:`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.on("line", (input) => {
        if (input === ".exit") {
            rl.close();
        } else if (input === "up") {
            currentDir = path.dirname(currentDir);
            console.log(`You are currently in ${currentDir}:`);
        } else if (input === "ls") {
            fs.readdir(currentDir, {withFileTypes: true}, (err, files) => {
                const filesArr = files.map((file) => [
                    file.name,
                    file.isDirectory() ? "directory" : "file",
                ]);
                const arrDir = filesArr.filter((file) => file[1] === "directory");
                const arrFile = filesArr.filter((file) => file[1] === "file");
                arrDir.sort();
                arrFile.sort();
                console.table(arrDir.concat(arrFile));
            });
        } else if (input.startsWith("cd")) {
            let dir = input.split(" ")[1];
            dir = path.isAbsolute(dir) ? dir : path.join(currentDir, dir);

            if (fs.existsSync(dir)) {
                currentDir = dir;
                console.log(`You are currently in ${currentDir}:`);
            } else {
                console.log("Operation failed");
            }
        } else if (input.startsWith("cat")) {
            const file = input.split(" ")[1];
            let filePath = path.join(currentDir, file);
            filePath = path.isAbsolute(filePath)
                ? path.join(filePath)
                : path.join(currentDir, filePath);

            if (fs.existsSync(filePath)) {
                const stream = fs.createReadStream(filePath);
                stream.on("data", (chunk) => {
                    console.log(chunk.toString());
                });
                console.log(`You are currently in ${currentDir}:`);
            } else {
                console.log("Operation failed");
            }
        } else if (input.startsWith("add")) {
            const file = input.split(" ")[1];
            const filePath = path.join(currentDir, file);
            const stream = fs.createWriteStream(filePath);

            stream.end();
        } else if (input.startsWith("rn")) {
            const [file, newFile] = input.split(" ").slice(1);
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
        } else if (input.startsWith("cp")) {
            const [file, pathDirectory] = input.split(" ").slice(1);
            const filePath = path.isAbsolute(file)
                ? file
                : path.join(currentDir, file);
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
        } else if (input.startsWith("mv")) {
            const [fileCur, pathDirectory] = input.split(" ").slice(1);
            const filePath = path.isAbsolute(fileCur)
                ? fileCur
                : path.join(currentDir, fileCur);
            let pathFinish = path.isAbsolute(pathDirectory)
                ? path.join(pathDirectory, fileCur)
                : path.join(currentDir, pathDirectory, fileCur);

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
        } else if (input.startsWith("rm")) {
            const file = input.split(" ")[1];
            const filePath = path.isAbsolute(file)
                ? file
                : path.join(currentDir, file);
            fs.unlink(filePath, (err) => {
                if (err) throw err;
                console.log("File deleted!");
            });
        } else if (input.startsWith("os")) {
            const params = input.split(" ")[1];
            if (params === "--EOL") {
                console.log(os.EOL);
            }
            if (params === "--cpus") {
                console.log("Total CPUs: ", os.cpus().length);
                console.log("CPU model: ", os.cpus()[0].model);
                for (let i = 0; i < os.cpus().length; i++) {
                    console.log(`CPU ${i + 1}: ${os.cpus()[i].speed} MHz`);
                }
            }
            if (params === "--homedir") {
                console.log("Home directory: ", os.homedir());
            }
            if (params === "--username") {
                console.log("Username: ", os.userInfo().username);
            }
            if (params === "--architecture") {
                console.log("Architecture: ", os.arch());
            }
        } else if (input.startsWith("hash")) {
            const file = input.split(" ")[1];
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
        } else if (input.startsWith("compress")) {
            const [file, fileDest] = input.split(" ").slice(1);
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
        } else if (input.startsWith("decompress")) {
            const [file, fileDest] = input.split(" ").slice(1);
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
        } else {
            console.log("Invalid input");
        }
    });

    rl.on("close", () => {
        console.log("Thank you for using File Manager, Username, goodbye!");
        process.exit(0);
    });
};

index();
