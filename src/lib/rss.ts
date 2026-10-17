import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        headers: {
          "User-Agent": "gator",
        },
        });

    const xmlString = await response.text();

    const parser = new XMLParser({
    processEntities: false,
    });

    const parsed = parser.parse(xmlString);
    const channel = parsed.rss?.channel;

    if (!channel) {
        throw new Error("RSS feed has no channel");
    }

    if (
    typeof channel.title !== "string" ||
    typeof channel.link !== "string" ||
    typeof channel.description !== "string"
    ) {
    throw new Error("RSS channel metadata is invalid");
    }

    const rawItems = channel.item
    ? Array.isArray(channel.item)
      ? channel.item
      : [channel.item]
    : [];

    const items: RSSItem[] = rawItems.filter(
    (item: unknown): item is RSSItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as RSSItem).title === "string" &&
      typeof (item as RSSItem).link === "string" &&
      typeof (item as RSSItem).description === "string" &&
      typeof (item as RSSItem).pubDate === "string",
    );

    return {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: items,
    },
    };
    }

