import { setUser } from '../config.ts'
type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]){
        if (!args.length){
        throw new Error("The login handler expects a single argument username")
    } else {
        setUser(args[0])
        console.log("user set", args[0]);
    }
     
        
}
