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

    }).returning();

    console.log("here is createPost", result);
    return result;
}

export async function getPostsForUser(numberOfPosts: number){
    const [result] = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(numberOfPosts);

    console.log("get post for users", result)

}

