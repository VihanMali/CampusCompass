import readline from "node:readline/promises";

import { searchCollege } from "../services/nominatim.js";
import { searchWikipedia, getWikipediaSummary } from "../services/mediaWiki.js";

import { chooseCollege } from "./utils/chooseCollege.js";
import { chooseWikipedia } from "./utils/chooseWikipedia.js";

import { createDraft } from "./createDraft.js";
import { saveDraft } from "./saveDraft.js";

async function main() {

  if (!process.argv[2]) {
    console.log(`Usage: npm run college:db -- "college name"`);
    console.log("                OR");
    console.log(`node ${process.argv[1]} <college-name>`);
    
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    const results = await searchCollege(process.argv[2]);

    if (!results) {
      console.log("College not found.");
      return;
    }

    const selected = await chooseCollege(results, rl);

    if (!selected) {
      return;
    }

    const college = {
      name: selected.name,
      city: selected.address.city,
      state: selected.address.state,
      
      center: {
        lat: Number(selected.lat),
        lng: Number(selected.lon)
      },

      description: null
    };

    console.log("\nSearching Wikipedia...\n");

    const wikiSearch = await searchWikipedia(college.name);

    const wikiPage = await chooseWikipedia(
      college.name,
      wikiSearch.pages,
      rl
    );

    if (wikiPage) {
      console.log("\nSelected:");
      console.log(wikiPage.title);

      const summary = await getWikipediaSummary(wikiPage);

      if (summary != null) {
        college.description = summary.extract;
      }
    }

    const draft = createDraft(college);

    await saveDraft(draft);

  } catch (err) {
    console.error(err.message);
  } finally {
    rl.close();
  }
}

main();