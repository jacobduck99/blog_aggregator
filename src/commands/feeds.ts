import { getFeedByUrl, getFeeds, createFeed, markFeedFetched } from '../lib/db/queries/feeds.ts'

import { fetchFeed } from '../lib/rss.ts'

export async function handlerCreateFeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
    }
    const [name, url] = args;

    const newFeed = await createFeed(name, url, user.id);
    const newFollow = await createFeedFollow(user.id, newFeed.id);
    printFeed(newFeed, user);
    console.log(`You are now following: ${newFollow.feedName}, by user: ${newFollow.userName}`);
}

export function printFeed(feed: feeds, user: users) {
    console.log(`* ID:        ${feed.id}`);
    console.log(`* Created:   ${feed.createdAt}`);
    console.log(`* Updated:   ${feed.updatedAt}`);
    console.log(`* Name:      ${feed.name}`);
    console.log(`* URL:       ${feed.url}`);
    console.log(`* User:      ${user.name}`);
}

export async function handlerFetchUrl(): Promise<void>{
    const fetch = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(fetch);
}


export async function handlerGetAllFeeds(): Promise<void>{
    await getFeeds();
}

export async function handlerScrapeFeeds(cmd: string, url: string){
    const feed = await getFeedByUrl(url);
    const feedId = feed.id;
    const markFetched = await markFeedFetched(feedId)
    return markFetched
}
