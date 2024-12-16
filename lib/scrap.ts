import * as cheerio from 'cheerio';

export async function extractFaviconAndDescription(url: string) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(url, { 
            method: 'GET',
            signal: controller.signal 
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch the URL: ${response.statusText}`);
        }

        const data = await response.text();

        // Load the HTML into Cheerio for parsing
        const $ = cheerio.load(data);

        // Try to extract the favicon
        let favicon = $("link[rel='icon']").attr('href') || $("link[rel='shortcut icon']").attr('href');

        // If favicon is a relative URL, prepend the website's base URL
        if (favicon && !favicon.startsWith('http')) {
            const urlObject = new URL(url);
            favicon = urlObject.origin + favicon;
        }

        // If no favicon found, provide a fallback favicon
        if (!favicon) {
            favicon = 'https://img.freepik.com/premium-vector/exclamation-mark-icon_535345-9201.jpg';
        }

        // Try to extract the description from the meta tag
        const description = $("meta[name='description']").attr('content') || "No description available";

        // Return the extracted data
        return { favicon, description };
    } 
    catch (error) {
        console.error("Error occurred:", error);
        return {
            favicon: 'https://img.freepik.com/premium-vector/exclamation-mark-icon_535345-9201.jpg',
            description: "No description available"
        };
    }
}
