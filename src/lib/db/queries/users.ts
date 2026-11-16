import { db } from "../index.ts";
import { users, feeds } from "../../../schema.ts";
import { eq } from "drizzle-orm";

export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;

export async function createUser(name: string): Promise<User> {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUser(name: string): Promise<User | undefined> {
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}

export async function deleteUsers(): Promise<void> {
    await db.delete(users);
}

export async function getUsers(): Promise<User[]> {
    return await db.select().from(users);
}
