import { askChoice } from "./askChoice.js";

export async function chooseCollege(results, rl) {
  console.log("\nTop search results:\n");

  results.forEach((place, index) => {
    console.log(`${index + 1}.`);

    console.log(`Name      : ${place.display_name}`);
    console.log(`Type      : ${place.type}`);
    console.log(`Category  : ${place.category}`);

    console.log();
  });

  const choice = await askChoice(
    rl,
    "Choose a college [0 to quit]: ",
    results.length
  );

  if (choice === 0) {
    return null;
  }

  return results[choice - 1];
}