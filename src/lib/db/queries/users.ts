import { db } from "../index.ts";
import { users } from "../../../schema.ts";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string){
    const [result] = await db.select(name).from(users);
    console.log("here's result", result);
    return result;
}
