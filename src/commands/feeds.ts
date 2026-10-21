import { getFeedByUrl, getFeeds } from '../lib/db/queries/feeds.ts'

import { fetchFeed } from '../lib/rss.ts'

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
