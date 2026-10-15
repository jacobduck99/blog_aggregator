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

function writeConfig(cfg: Config): void{
    const path = getConfigFilePath()
    const jsonString = JSON.stringify(cfg);
    const write = fs.writeFileSync(path ,jsonString, 'utf8')
    console.log("write config", jsonString);  
}

// function validateConfig(rawConfig: any): Config{
//
// }



// export function setUser(currentUserName: string): void{
//     const getFile = readConfig(getPath);
//     // const userNameString = `current_user_name: ${currentUserName}`;
//     const jsonString = JSON.stringify(userNameString);
//     const writeFile = fs.writeFileSync(getPath, jsonString, { flag: 'a'});    
// }

export function readConfig(filePath: string){
    const readFile = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(readFile);
    console.log("here's file", data);  
}

const getPath = getConfigFilePath()

// readConfig(getPath);
const activeConfig: Config = { dbUrl: getPath, currentUserName: "jacob" };
writeConfig(activeConfig);
readConfig(getPath);
// setUser("jacob");
