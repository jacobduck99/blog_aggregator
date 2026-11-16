import { db } from "../index.ts";
import { posts, feeds, feed_follows } from "../../../schema.ts";
import { eq, sql } from "drizzle-orm";

export async function createPost(title: string, url: string, feedId: string, description?: string, publishedAt?: Date){
    const [result] = await db.insert(posts).values({ 
        title: title,
        url: url,
        feedId: feedId,
        description: description,
        publishedAt: publishedAt,

    })
    // post URLs are unique: re-scraping a feed skips posts we already have
    .onConflictDoNothing({ target: posts.url })
    .returning();

    return result; // undefined if the post was already saved
}

// Newest posts from the feeds this user follows.
export async function getPostsForUser(userId: string, limit: number) {
    return await db
        .select({
            title: posts.title,
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt,
            feedName: feeds.name,
        })
        .from(posts)
        .innerJoin(feed_follows, eq(feed_follows.feed_id, posts.feedId))
        .innerJoin(feeds, eq(feeds.id, posts.feedId))
        .where(eq(feed_follows.user_id, userId))
        .orderBy(sql`${posts.publishedAt} DESC NULLS LAST`)
        .limit(limit);
}

