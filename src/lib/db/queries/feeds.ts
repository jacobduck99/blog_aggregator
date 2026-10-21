import { db } from "../index.ts";
import { eq } from "drizzle-orm";
import { users, feeds, feed_follows } from "../../../schema.ts";

export async function createFeed(name: string, url: string, user_id: string): Promise<String[]>{
    const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: user_id }).returning();
    return result;
}

export async function getFeeds(): Promise<void> {
    const result = await db.select({
        name: feeds.name,
        url: feeds.url,
        userName: users.name,
    }).from(feeds).innerJoin(users, eq(users.id, feeds.user_id))
    for (const r of result){
        console.log(r.name, r.url, r.userName);
    }
}

export async function getFeedByUrl(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function getUserFeeds(): Promise<string>{
    const [userFeed] = await db.select().from(feeds);
    console.log("here's user feed", userFeed);
    return userFeed;

}

export async function markFeedFetched(feedid: string){
    const now = new date();
    const result = await db.update(feeds).set({ updatedat: now, lastfetchedat: now }).where(eq(feeds.id, feedid));
}

// export async function get
