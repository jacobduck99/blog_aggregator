import { db } from "../index.ts";
import { users, feeds, feed_follows } from "../../../schema.ts";
import { eq, and } from "drizzle-orm";

export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;

type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

export async function createUser(name: string): Promise<string[]>{
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUser(name: string): Promise<string[]>{
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}

export async function deleteUsers(): Promise<string[]>{
    const [result] = await db.delete(users);
    return result;
}

export async function getUsers(): Promise<string[]>{
    const result = await db.select().from(users);
    return result;
}

export async function createFeed(name: string, url: string, user_id: string): Promise<String[]>{
    const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: user_id }).returning();
    return result;
}

export function printFeed(feed: feeds, user: users) {
    console.log(`* ID:        ${feed.id}`);
    console.log(`* Created:   ${feed.createdAt}`);
    console.log(`* Updated:   ${feed.updatedAt}`);
    console.log(`* Name:      ${feed.name}`);
    console.log(`* URL:       ${feed.url}`);
    console.log(`* User:      ${user.name}`);
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

export async function deleteFeedFollow(userId: string, url: string) {
    const feed = await getFeedByUrl(url);
    if (!feed) {
    throw new Error(`no feed found with url: ${url}`);
    }

    const [deleted] = await db
    .delete(feed_follows)
    .where(
      and(
        eq(feed_follows.user_id, userId),
        eq(feed_follows.feed_id, feed.id)
      )
    )
    .returning();

    return deleted;
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

export async function markFeedFetched(feedId: string){
    const now = new Date();
    const result = await db.update(feeds).set({ updatedAt: now, lastFetchedAt: now }).where(eq(feeds.id, feedId));
}

// export async function get































