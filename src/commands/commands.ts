import { setUser, readConfig } from '../config.ts'
import { exit } from 'node:process';
import { createUser, getUser, deleteUsers, getUsers } from '../lib/db/queries/users.ts'

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void>{
    if (!args.length){
        throw new Error("The login handler expects a single argument username")
    } else {
        const checkUser = await getUser(args[0])
        if (!checkUser){
            throw new Error("Username doesn't exist in the database")
        }else {
            setUser(args[0])
            console.log("user set", args[0]);
        }
    }
}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void>{
    if (!args.length){
        throw new Error("The register handler expects a single argument username")
    } else {
        const checkUser = await getUser(args[0])
        if (checkUser){
            throw new Error("User already exits");
        } else {
            const newUser = await createUser(args[0])
            setUser(args[0])
            console.log("New user created ", newUser);
        }
    }
}

export async function handlerReset(): Promise<void>{
    const resetDb = await deleteUsers();
    if (!resetDb){
        process.exit(0);
    }else {
        proces.exit(1);
    }

}

export async function handlerGetUsers(): Promise<void>{
    const users = await getUsers();
    const checkLoggedIn = readConfig()
    for (const user of users){
        if (user.name == checkLoggedIn.currentUserName){
            console.log(`${user.name} (current)`);
        }
        else {
            console.log(user.name)
        }
    }
}

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
   if (cmdName in registry){
        const fn = registry[cmdName]
        await fn(cmdName, ...args); 
    }else {
        throw new Error("Command doesn't exist in look up table");
    } 
}


