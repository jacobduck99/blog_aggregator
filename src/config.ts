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

export function setUser(currentUserName: string): void{
    const userName = currentUserName;
    const current = readConfig();
    const updated: Config = {
      dbUrl: current.dbUrl,
      currentUserName: currentUserName,
    };
    const toWrite = {
      db_url: updated.dbUrl,
      current_user_name: updated.currentUserName,
    };
    const jsonString = JSON.stringify(toWrite);
    const writeFile = fs.writeFileSync(getConfigFilePath(), jsonString);   
}

export function readConfig(): Config{
    const readFile = fs.readFileSync(getConfigFilePath(), 'utf8');
    const raw = JSON.parse(readFile);
    return {
    dbUrl: raw.db_url,
    currentUserName: raw.current_user_name,
};
}


