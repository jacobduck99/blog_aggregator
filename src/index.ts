import { setUser, readConfig } from './config.ts'
import { handlerLogin, handlerRegister, handlerReset, handlerGetUsers, registerCommand, CommandsRegistry, runCommand} from './commands/commands.ts'
import { getUsers } from '../src/lib/db/queries/users.ts'
import { fetchFeed } from './lib/rss.ts' //was testing out function 

async function main() {
    const commandRegistry: CommandsRegistry = {};
    await registerCommand(commandRegistry, "login", handlerLogin);
    await registerCommand(commandRegistry, "register", handlerRegister);
    await registerCommand(commandRegistry, "reset", handlerReset);
    await registerCommand(commandRegistry, "users", handlerGetUsers);


    await fetchFeed("https://www.wagslane.dev/index.xml") //Was testing out function

    const args = process.argv.slice(2);

    if (args.length < 1) {
    console.error("not enough arguments were provided");
    process.exit(1);
    }

    const [cmdName, ...cmdArgs] = args;

    try {
    await runCommand(commandRegistry, cmdName, ...cmdArgs);
    } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
    }

    process.exit(0);
    }

main();
