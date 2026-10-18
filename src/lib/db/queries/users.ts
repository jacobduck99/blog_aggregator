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
    console.log("here's result create feed", result);
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

export async function getFeeds(): Promise<void>{
    const result = await db.select({
        name: feeds.name,
        url: feeds.url,
        userName: users.name,
    }).from(feeds).innerJoin(users, eq(users.id, feeds.user_id))
    for (const r of result){
        console.log(r.name, r.url, r.userName);
    }
}

/// NEED TO PUT FEED ID BACK IN PARAMETER AND VALUES FOR INSERT
export async function createFeedFollow(user_id: string): Promise<string[]>{
    const [newFeedFollow] = await db.insert(feed_follows).values({ user_id: user_id }).returning();
    console.log("new feed follow", newFeedFollow);
    return newFeedFollow;
}

export async function getUserfeeds(): Promise<string>{
    const [userFeed] = await db.insert(feeds).select().returning();
    console.log("here's user feed", userFeed);
    return userFeed;

}
