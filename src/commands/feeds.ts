import { getFeeds, createFeed, markFeedFetched, getNextFeedToFetch } from '../lib/db/queries/feeds.ts'
import { createFeedFollow } from '../lib/db/queries/feed_follows.ts'
import type { User, Feed } from '../lib/db/queries/users.ts'
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

export function printFeed(feed: Feed, user: User) {
    console.log(`* ID:        ${feed.id}`);
    console.log(`* Created:   ${feed.createdAt}`);
    console.log(`* Updated:   ${feed.updatedAt}`);
    console.log(`* Name:      ${feed.name}`);
    console.log(`* URL:       ${feed.url}`);
    console.log(`* User:      ${user.name}`);
}

export async function handlerGetAllFeeds(): Promise<void> {
    await getFeeds();
}

export async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log("No feeds to fetch");
        return;
    }

    await markFeedFetched(feed.id);
    const rss = await fetchFeed(feed.url);

    console.log(`Fetched ${feed.name}:`);
    for (const item of rss.channel.item) {
        console.log(`* ${item.title}`);
    }
}

export function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error(`Invalid duration: "${durationStr}". Use a number followed by ms, s, m or h (e.g. 500ms, 1s, 1m, 1h)`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case "ms": return value;
        case "s":  return value * 1000;
        case "m":  return value * 60 * 1000;
        case "h":  return value * 60 * 60 * 1000;
        default:   throw new Error(`Unknown unit: ${unit}`);
    }
}

function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h${m}m${s}s`;
    if (m > 0) return `${m}m${s}s`;
    return `${s}s`;
}

function handleError(err: unknown) {
    console.error("Error scraping feeds:", (err as Error).message);
}

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_between_reqs>  (e.g. 30s, 1m)`);
    }

    const timeBetweenRequests = parseDuration(args[0]);
    console.log(`Collecting feeds every ${formatDuration(timeBetweenRequests)}`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}
