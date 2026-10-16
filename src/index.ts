import { setUser, readConfig } from './config.ts'
import { handlerLogin, registerCommand, CommandsRegistry} from './commands/commands.ts'

function main() {
    // const read = readConfig()
    // console.log(read);
    const commandRegistry: CommandsRegistry = {};
    registerCommand(commandRegistry, "login", handlerLogin);
    handlerLogin("login", "Jacob")
    // runCommand(commandRegistry, "login", "is this working");
}

main();
