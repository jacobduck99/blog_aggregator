import { db } from "../index.ts";
import { users } from "../../../schema.ts";
import { eq } from "drizzle-orm";

export async function createUser(name: string): Promise<string[]>{
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string): Promise<string[]>{
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}
