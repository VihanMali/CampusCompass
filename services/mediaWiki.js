const MEDIA_WIKI_BASE_URL = "https://en.wikipedia.org/w/rest.php/v1";
const MEDIA_WIKI_SUMMARY_URL = "https://en.wikipedia.org/api/rest_v1";

export async function searchWikipedia(college) {

  if (!college) {
    console.error("searchWikipedia was called without a college name");
    return null;
  }

  const url = new URL(`${MEDIA_WIKI_BASE_URL}/search/title`);

  url.searchParams.set("q", college);
  url.searchParams.set("limit", 5);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CampusCompass-StudentProject/1.0 (dinku@local.dev)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("MediaWiki search failed:", error);
    return null;
  }
}

export async function getWikipediaSummary(page) {
  const url = `${MEDIA_WIKI_SUMMARY_URL}/page/summary/${encodeURIComponent(page.key)}`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CampusCompass-StudentProject/1.0 (dinku@local.dev)'
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return await response.json();
  } catch (error) {
    console.error("MediaWiki Summary failed:", error);
    return null;
  }
}