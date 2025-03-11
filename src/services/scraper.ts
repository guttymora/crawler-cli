import FirecrawlApp from '@mendable/firecrawl-js';
import config from 'config';

const app = new FirecrawlApp({
    apiKey: config.get('firecrawl.apiKey'),
});

const scrape = async (url: string): Promise<string[]> => {
    const response = await app.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
            formats: ['markdown'],
        },
    });

    if (!response.success) {
        throw new Error(`Failed to crawl: ${response.error}`);
    }

    return response.data.map((doc) => doc.markdown!);
};

export const scraper = { scrape };
// scrape('https://docs.github.com/en/rest/copilot?apiVersion=2022-11-28');
