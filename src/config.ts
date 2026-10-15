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

const getPath = getConfigFilePath();

console.log("here's path", getPath);
// function writeConfig(cfg: Config): void{
//     fs.writeFileSync(getPath ,cfg,)
// }

export function setUser(currentUserName: string): void{
    const jsonString = JSON.stringify(currentUserName);
    const writeFile = fs.writeFileSync(getPath, jsonString);    
}

export function readConfig(filePath: string){
    const readFile = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(readFile);
    console.log("here's file", data);
}

setUser("jacob");
readConfig(getPath);
