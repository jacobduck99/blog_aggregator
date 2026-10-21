import { 
    createFeedFollow, 
    getFeedFollowsForUser, 
    deleteFeedFollow } 

from '../lib/db/queries/feed_follows.ts'

import { 
    createFeed, 
    getFeedByUrl, 
    printFeed } 

from '../lib/db/queries/feeds.ts'

export async function handlerCreateFeedFollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
    }
    const url = args[0];

    const feed = await getFeedByUrl(url);
    if (!feed) {
    throw new Error(`no feed found with url: ${url}`);
    }

    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log(`${feedFollow.userName} is now following ${feedFollow.feedName}`);
}

export async function handlerGetAllFollowsForUser(cmdName: string, user: User, ...args: string[]): Promise<void> {
    const follows = await getFeedFollowsForUser(user.id);
    if (follows.length === 0) {
        throw new Error("You don't follow anyone yet");
    }
    for (const f of follows) {
        console.log(f.feedName);
    }
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} need feed url only`);
    }

    const url = args[0];
    const deleted = await deleteFeedFollow(user.id, url);

    if (!deleted) {
    throw new Error(`${user.name} isn't following ${url}`);
    }

    console.log(`${user.name} unfollowed ${url}`);
}
