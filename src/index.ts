import { setUser, readConfig } from './config.ts'

function main() {
    const setUser1 = setUser("steve")
    const read = readConfig()
    console.log(read);
}

main();
