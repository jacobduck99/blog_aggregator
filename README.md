# gator

A command-line RSS feed aggregator written in TypeScript. Register users, add and follow RSS feeds, run a background aggregator that scrapes feeds into Postgres, and browse the latest posts from your terminal.

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
| `browse [limit]` | Show the most recent posts |
| `reset` | Delete all users (and their data). Use with care |

### Example session

```bash
npm run start register jake
npm run start addfeed "Hacker News" https://hnrss.org/newest
npm run start agg 1m        # leave running in one terminal
npm run start browse 5      # in another terminal
```
