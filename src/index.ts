import { setUser, readConfig } from './config.ts'
import { handlerLogin, registerCommand, CommandsRegistry, runCommand} from './commands/commands.ts'

function main() {
    const commandRegistry: CommandsRegistry = {};
    registerCommand(commandRegistry, "login", handlerLogin);

    const args = process.argv.slice(2);

    if (args.length < 1) {
    console.error("not enough arguments were provided");
    process.exit(1);
    }

    const [cmdName, ...cmdArgs] = args;

    try {
    runCommand(commandRegistry, cmdName, ...cmdArgs);
    } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
    }
    }

main();
