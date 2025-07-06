import { ofetch } from 'ofetch';

/**
 * Creates a delay for a specified amount of time.
 * @param {number} ms Milliseconds to wait.
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates common headers for scraping to mimic a real browser.
 * @returns {Object} A header object with User-Agent.
 */
function getScrapingHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Connection': 'keep-alive',
  };
}

/**
 * Fetches HTML content from a URL using ofetch with standard headers.
 * This can be expanded to include proxy support.
 * @param {string} url The URL to fetch.
 * @returns {Promise<string>} The HTML content of the page.
 */
export async function fetchHtml(url) {
  try {
    // Add a random delay to be less predictable (e.g., between 500ms and 1500ms)
    const randomDelay = 500 + Math.random() * 1000;
    await delay(randomDelay);

    const response = await ofetch(url, {
      headers: getScrapingHeaders(),
      responseType: 'text'
    });
    return response;
  } catch (error) {
    console.error(`Error fetching HTML from ${url}:`, error.message);
    throw new Error(`Could not fetch HTML from ${url}. Status: ${error.statusCode}`);
  }
}

/**
 * Extracts embedded JSON from a script tag within HTML content.
 * Specifically looks for a script tag containing 'window.pageData'.
 * @param {string} html The HTML content to parse.
 * @returns {Object|null} The parsed JSON object, or null if not found.
 */
export function extractLazadaJson(html) {
  try {
    // This regex is specific to Lazada's structure and might need updates.
    const match = html.match(/<script>window\.__PRELOADED_STATE__\s*=\s*({.+?});<\/script>/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    // Fallback or alternative regex might be needed if the structure changes.
    const alternativeMatch = html.match(/<script type="application\/ld\+json">({.*?})<\/script>/s);
     if (alternativeMatch && alternativeMatch[1]) {
      const jsonData = JSON.parse(alternativeMatch[1]);
      // Check if it's product data
      if (jsonData['@type'] === 'Product') {
        return jsonData;
      }
    }
    return null;
  } catch (error) {
    console.error('Error parsing embedded JSON:', error);
    return null;
  }
} 