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

// need to change return back to Promise<RSSItem[]>
export async function fetchFeed(feedURL: string): Promise<RSSItem[]> {
    const response = await fetch(feedURL, {
        headers: {
          "User-Agent": "gator",
        },
      });

    const xmlString = await response.text();
    const parser = new XMLParser();
    const setFalse = parser.options.processEntities.enabled = false
    console.log("parser", parser);

    let obj = parser.parse(xmlString);
    let items: string = [];

    console.log("obj", obj);
    if (!obj.rss?.channel) {
      throw new Error("Channel doesn't exist");
    } else {
        const title = obj.rss.channel.title;
        const link = obj.rss.channel.link;
        const description = obj.rss.channel.description
        console.log("here's title", title);
        console.log("here's link", link);
        console.log("here's description", description);
        if (!obj.rss?.channel.item){
            items = []; 
            console.log("here's your items", items);
        } else {
            const checkA = Array.isArray(obj.rss.channel.item)
            items = obj.rss.channel.item;
            console.log("here's channel in the else statement", items)
            items.forEach((i) => console.log(i.title));
        }

        const channel = { channel: items }

        console.log("here's channel", channel);

    return channel

    }





  // Create an XMLParser here.
  // Parse xmlString.
  // Validate and extract the channel metadata and items.
  // Return an RSSFeed-shaped object.
}

