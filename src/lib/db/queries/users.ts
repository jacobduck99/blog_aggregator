import { db } from "../index.ts";
import { users, feeds, feed_follows } from "../../../schema.ts";
import { eq } from "drizzle-orm";

export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;

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

export async function createFeedFollow(userId: string, feedId: string) { 
    const [newFeedFollow] = await db.insert(feed_follows).values({ 
        user_id: userId, 
        feed_id: feedId }).returning();
    const [result] = await db.select({ 
        id: feed_follows.id, 
        createdAt: feed_follows.createdAt, 
        updatedAt: feed_follows.updatedAt,
        feedName: feeds.name,
        userName: users.name, 
    }).from(feed_follows).innerJoin(feeds, eq(feed_follows.feed_id, feeds.id)).innerJoin(users, eq(feed_follows.user_id, users.id)).where(eq(feed_follows.id, newFeedFollow.id))
    return result;
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

export async function getFeedFollowsForUser(userId: string) {
    const result = await db.select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        feedName: feeds.name,
        userName: users.name,
    })
    .from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .where(eq(feed_follows.user_id, userId));
    console.log("result get feed follower users", result);
    return result;
}
