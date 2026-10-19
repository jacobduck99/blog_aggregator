import { setUser, readConfig } from '../config.ts'
import { exit } from 'node:process';
import { createUser, getUser, deleteUsers, getUsers, createFeed, printFeed, getFeeds, createFeedFollow, getUserFeeds, getFeedByUrl, getFeedFollowsForUser } from '../lib/db/queries/users.ts'
import { fetchFeed } from '../lib/rss.ts'

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void>{
    if (!args.length){
        throw new Error("The login handler expects a single argument username")
    } else {
        const checkUser = await getUser(args[0])
        if (!checkUser){
            throw new Error("Username doesn't exist in the database")
        }else {
            setUser(args[0])
            console.log("user set", args[0]);
        }
    }
}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void>{
    if (!args.length){
        throw new Error("The register handler expects a single argument username")
    } else {
        const checkUser = await getUser(args[0])
        if (checkUser){
            throw new Error("User already exits");
        } else {
            const newUser = await createUser(args[0])
            setUser(args[0])
            console.log("New user created ", newUser);
        }
    }
}

export async function handlerReset(): Promise<void>{
    const resetDb = await deleteUsers();
    if (!resetDb){
        process.exit(0);
    }else {
        process.exit(1);
    }

}

export async function handlerGetUsers(): Promise<void>{
    const users = await getUsers();
    const checkLoggedIn = readConfig()
    for (const user of users){
        if (user.name === checkLoggedIn.currentUserName){
            console.log(`${user.name} (current)`);
        }
        else {
            console.log(user.name)
        }
    }
}

export async function handlerFetchUrl(): Promise<void>{
    const fetch = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(fetch);
}

export async function handlerCreateFeed(cmd: string, name: string, url: string): Promise<void>{
    const loggedIn = readConfig().currentUserName;
    const user = await getUser(loggedIn);
    const userId = user.id;
    const newFeed = await createFeed(name, url, userId);
    const feedId = newFeed.id;
    const newFollow = await createFeedFollow(userId, feedId)
    const feedName = newFollow.feedName;
    const userName = newFollow.userName;
    printFeed(newFeed, user);
    console.log(feedName, userName);
    
    }

export async function handlerGetAllFeeds(): Promise<void>{
    await getFeeds();
}

export async function handlerCreateFeedFollow(cmd: string, url: string): Promise<void> {
    const loggedIn = readConfig().currentUserName;
    const user = await getUser(loggedIn);

    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`no feed found with url: ${url}`);
    }

    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log(`${feedFollow.userName} is now following ${feedFollow.feedName}`);
}

export async function handlerGetAllFollowsForUser(): Promise<string>{
    const loggedIn = readConfig().currentUserName;
    const user = await getUser(loggedIn);
    const userId = user.id;

    const getFollowsForUser = await getFeedFollowsForUser(userId);
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


