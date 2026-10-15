import { setUser } from '../config.ts'
type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>

export function handlerLogin(cmdName: string, ...args: string[]): void{
        if (!args.length){
        throw new Error("The login handler expects a single argument username")
    } else {
        setUser(args[0])
        console.log("user set", args[0]);
    }
     
        
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler
}
