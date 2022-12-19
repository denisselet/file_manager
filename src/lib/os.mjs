import os from "os";

export const osParam = (params) => {
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
};
