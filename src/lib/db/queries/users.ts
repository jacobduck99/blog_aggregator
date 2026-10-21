import { db } from "../index.ts";
import { users, feeds, feed_follows } from "../../../schema.ts";
import { eq, and } from "drizzle-orm";

export type user = typeof users.$inferselect;
export type feed = typeof feeds.$inferselect;

type usercommandhandler = (
    cmdname: string,
    user: user,
    ...args: string[]
) => promise<void>;

export async function createUser(name: string): promise<string[]>{
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUser(name: string): promise<string[]>{
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}

export async function deleteUsers(): promise<string[]>{
    const [result] = await db.delete(users);
    return result;
}

export async function getUsers(): promise<string[]>{
    const result = await db.select().from(users);
    return result;
}

































