import { db } from "../index.ts";
import { posts } from "../../../schema.ts";
import { eq, and, desc } from "drizzle-orm";

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

export async function getPostsForUser(cmd: string, numberOfPosts?: number){
    const num = Number(numberOfPosts);
    const result = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(num);

    console.log("get post for users", result)
    return result;

}

