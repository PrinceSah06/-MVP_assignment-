import { db } from "../config/db";
import { redis } from "../config/redis";
import { agents } from "../db/schema";

export async function assignAgent() {

  // get all agents
  const agentList = await db.select().from(agents);

  if (agentList.length === 0) {
    throw new Error("No agents available");
  }

  // get current index from redis
  const currentIndex = await redis.get("lead_assignment_index");

  let index = currentIndex ? parseInt(currentIndex) : 0;

  // pick agent
  const agent = agentList[index % agentList.length];

  // update index
  await redis.set("lead_assignment_index", index + 1);

  return agent.id;
}