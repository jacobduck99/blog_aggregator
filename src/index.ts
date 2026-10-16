import { setUser, readConfig } from './config.ts'
import { handlerLogin, registerCommand, CommandsRegistry, runCommand} from './commands/commands.ts'

function main() {
    const commandRegistry: CommandsRegistry = {};
    registerCommand(commandRegistry, "login", handlerLogin);
    runCommand(commandRegistry, "login", "Jakob");
}

main();
