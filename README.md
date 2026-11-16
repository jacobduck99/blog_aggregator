# gator

A command-line RSS feed aggregator written in TypeScript. Register users, add and follow RSS feeds, run a background aggregator that scrapes feeds into Postgres, and browse the latest posts from your terminal.

## How It Works

- **Multi-user:** users, feeds and follows live in Postgres. The current user is stored in a config file, so commands act as whoever is logged in.
- **Login-guarded commands:** commands that need a user (`addfeed`, `follow`, `following`, `unfollow`, `browse`) are wrapped in a `middlewareLoggedIn` higher-order function, so the login check is written once instead of in every handler.
- **Fair scraping:** `agg` runs on an interval and each tick fetches the feed that was fetched *longest ago* (never-fetched feeds first, `ORDER BY last_fetched_at ASC NULLS FIRST`). Every feed gets its turn, and no site is hammered.
- **Safe RSS parsing:** feeds are parsed with `fast-xml-parser` and each item is type-checked before it's saved, so a malformed feed is skipped instead of crashing the aggregator. Post URLs are unique, so re-scraping a feed doesn't create duplicates.
- **Type-safe database:** Drizzle ORM schema with versioned SQL migrations.

## Requirements

- **Node.js** (v20+ recommended) and **npm**
- **PostgreSQL** (v15+), running locally or reachable over the network
- **Git**, to clone the repo

## Installation

```bash
git clone https://github.com/jacobduck99/blog_aggregator.git
cd blog_aggregator
npm install
```

## Database setup

Create a database for gator:

```bash
psql -U postgres -c "CREATE DATABASE gator;"
```

Then run the migrations to create the tables:

```bash
npx drizzle-kit migrate
```

## Config file

gator reads its settings from a JSON file in your home directory: `~/.gatorconfig.json`.

Create it with your database connection string:

```json
{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable"
}
```

Change the username, password, host and port to match your Postgres setup. gator writes the current logged-in user into this file for you when you `register` or `login`, so you don't need to add it by hand.

## Usage

Run any command with:

```bash
npm run start <command> [args...]
```

### Commands

| Command | Description |
| --- | --- |
| `register <name>` | Create a new user and log in as them |
| `login <name>` | Switch to an existing user |
| `users` | List all users (marks the current one) |
| `addfeed <name> <url>` | Add a feed and automatically follow it (requires login) |
| `feeds` | List all feeds |
| `follow <url>` | Follow an existing feed (requires login) |
| `following` | List the feeds the current user follows (requires login) |
| `unfollow <url>` | Unfollow a feed (requires login) |
| `agg <interval>` | Continuously scrape feeds, e.g. `agg 30s`, `agg 1m`. Stop with Ctrl+C |
| `browse [limit]` | Show the newest posts from feeds you follow (default 2) (requires login) |
| `reset` | Delete all users (and their data). Use with care |

### Example session

```bash
npm run start register jake
npm run start addfeed "Hacker News" https://hnrss.org/newest
npm run start agg 1m        # leave running in one terminal
npm run start browse 5      # in another terminal
```

## Project Structure

```
src/
├── index.ts               # entry point: registers commands and dispatches argv
├── config.ts              # reads/writes ~/.gatorconfig.json
├── schema.ts              # Drizzle table definitions
├── commands/              # one handler per CLI command, plus login middleware
└── lib/
    ├── rss.ts             # fetch + parse + validate an RSS feed
    └── db/
        ├── queries/       # users, feeds, feed_follows, posts
        └── *.sql          # generated migrations
```

## Development

Type-check the project (the app runs through `tsx`, which doesn't type-check):

```bash
npm run typecheck
```

After changing `src/schema.ts`, generate and apply a migration:

```bash
npm run generate
npm run migrate
```

## Tech Stack

TypeScript · Node.js · PostgreSQL · Drizzle ORM · fast-xml-parser · tsx
