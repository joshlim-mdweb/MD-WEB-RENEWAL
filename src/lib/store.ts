import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  createdAt: string;
  totalVotes: number;
}

const DB_PATH = path.join(process.cwd(), "data", "polls.json");

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

export function getPolls(): Poll[] {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as Poll[];
}

export function getPoll(id: string): Poll | undefined {
  return getPolls().find((p) => p.id === id);
}

export function createPoll(question: string, options: string[]): Poll {
  const polls = getPolls();
  const poll: Poll = {
    id: randomUUID(),
    question,
    options: options.map((text) => ({ id: randomUUID(), text, votes: 0 })),
    createdAt: new Date().toISOString(),
    totalVotes: 0,
  };
  polls.unshift(poll);
  fs.writeFileSync(DB_PATH, JSON.stringify(polls, null, 2));
  return poll;
}

export function vote(pollId: string, optionId: string): Poll | null {
  const polls = getPolls();
  const poll = polls.find((p) => p.id === pollId);
  if (!poll) return null;
  const option = poll.options.find((o) => o.id === optionId);
  if (!option) return null;
  option.votes += 1;
  poll.totalVotes += 1;
  fs.writeFileSync(DB_PATH, JSON.stringify(polls, null, 2));
  return poll;
}
