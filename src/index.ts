import { setUser, readConfig } from './config.ts'
import { handlerLogin } from './commands/commands.ts'

function main() {
    const read = readConfig()
    console.log(read);
    handlerLogin("login", "Jacob")
}

main();
