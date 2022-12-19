import readline from "readline";
import os from "os";
import path from "path";
import fs from "fs";
import {copyFile} from "./lib/copyFile.mjs";
import {moveFile} from "./lib/moveFile.mjs";
import {removeFile} from "./lib/removeFile.mjs";
import {renameFile} from "./lib/renameFile.mjs";
import {osParam} from "./lib/os.mjs";
import {hash} from "./lib/hash.mjs";
import {compressZlib} from "./lib/zlib/compress.mjs";
import {decompressZlib} from "./lib/zlib/decompress.mjs";

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
            renameFile(file, newFile, currentDir);
        } else if (input.startsWith("cp")) {
            const [file, pathDirectory] = input.split(" ").slice(1);
            copyFile(file, pathDirectory, currentDir);
        } else if (input.startsWith("mv")) {
            moveFile(input.split(" ")[1], input.split(" ")[2], currentDir);
        } else if (input.startsWith("rm")) {
            removeFile(input.split(" ")[1], currentDir);
        } else if (input.startsWith("os")) {
            osParam(input.split(" ")[1]);
        } else if (input.startsWith("hash")) {
            const file = input.split(" ")[1];
            hash(file, currentDir);
        } else if (input.startsWith("compress")) {
            const [file, fileDest] = input.split(" ").slice(1);
            compressZlib(file, fileDest, currentDir);
        } else if (input.startsWith("decompress")) {
            const [file, fileDest] = input.split(" ").slice(1);
            decompressZlib(file, fileDest, currentDir);
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
