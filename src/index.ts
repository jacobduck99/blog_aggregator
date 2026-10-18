import { setUser, readConfig } from './config.ts'
import { handlerLogin, handlerRegister, handlerReset, handlerGetUsers, handlerFetchUrl, handlerCreateFeed, handlerGetAllFeeds, handlerCreateFeedFollow, registerCommand, CommandsRegistry, runCommand} from './commands/commands.ts'
import { getUsers } from '../src/lib/db/queries/users.ts'

async function main() {
    const commandRegistry: CommandsRegistry = {};
    await registerCommand(commandRegistry, "login", handlerLogin);
    await registerCommand(commandRegistry, "register", handlerRegister);
    await registerCommand(commandRegistry, "reset", handlerReset);
    await registerCommand(commandRegistry, "users", handlerGetUsers);
    await registerCommand(commandRegistry, "agg", handlerFetchUrl);
    await registerCommand(commandRegistry, "addfeed", handlerCreateFeed);
    await registerCommand(commandRegistry, "feeds", handlerGetAllFeeds);
    await registerCommand(commandRegistry, "follow", handlerCreateFeedFollow);

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
