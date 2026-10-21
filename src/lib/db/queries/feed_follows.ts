import { db } from "../index.ts";
import { users, feeds, feed_follows } from "../../../schema.ts";
import { eq, and } from "drizzle-orm";

import { getFeedByUrl } from './feeds.ts'

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
    return result;
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
