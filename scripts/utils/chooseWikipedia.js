import { normalize } from "./normalize.js";
import { askChoice } from "./askChoice.js";

function findBestMatch(collegeName, pages) {
  const normalizedCollege = normalize(collegeName);

  for (const page of pages) {
    const normalizedTitle = normalize(page.title);

    if (
      normalizedCollege.includes(normalizedTitle) ||
      normalizedTitle.includes(normalizedCollege)
    ) {
      return page;
    }

  }

  return null;
}

export async function chooseWikipedia(collegeName, pages, rl) {

  if (pages.length === 0) {
    return null;
  }

  const best = findBestMatch(collegeName, pages);

  if (best) {
    console.log("\nPossible match found:\n");

    console.log(best.title);
    console.log(best.description);

    const answer = await rl.question("\nUse this? (Y/n): ");

    if (answer === "" || answer.toLowerCase() === "y") {
      return best;
    }
  }

  console.log("\nWikipedia search results:\n");

  pages.forEach((page, index) => {
    console.log(`${index + 1}.`);
    console.log(page.title);
    console.log(page.description);
    console.log();
  });

  const choice = await askChoice(
    rl,
    "Choose page [0 to skip]: ",
    pages.length
  );

  if (choice === 0) {
    return null;
  }

  return pages[choice - 1];
}