import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string;
    };

function getConfigFilePath(): string{
    const homeDir = os.homedir()
    return path.join(homeDir, '.gatorconfig.json');
}

const test = getConfigFilePath();

console.log("here's path", test);
// function writeConfig(cfg: Config): void{
//     fs.writeFileSync( ,cfg,)
// }

export function setUser(currentUserName: string): string{

}
