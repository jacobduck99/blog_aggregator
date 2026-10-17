import { setUser } from '../config.ts'
import { exit } from 'node:process';
import { createUser } from '../lib/db/queries/users.ts'

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>

export async function handlerLogin(cmdName: string, ...args: string[]): void{
    if (!args.length){
        throw new Error("The login handler expects a single argument username")
    } else {
        setUser(args[0])
        console.log("user set", args[0]);
    }
}

export async function handlerRegister(cmdName: string, ...args: string[]): void{
    if (!args.length){
        throw new Error("The register handler expects a single argument username")
    } else {
        await createUser(args[0])
        // if (args[0] in createUser){
            console.log("here's args in handlerRegister", args[0])
        // }
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


