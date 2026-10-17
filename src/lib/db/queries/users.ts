import { db } from "../index.ts";
import { users, feeds } from "../../../schema.ts";
import { eq } from "drizzle-orm";

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
