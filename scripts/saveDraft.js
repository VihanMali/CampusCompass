import { mkdir, writeFile } from "fs/promises";

export async function saveDraft(draft) {

  const filename = draft.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  await mkdir("./scripts/drafts", {
    recursive: true
  });

  await writeFile(
    `./scripts/drafts/${filename}.json`,
    JSON.stringify(draft, null, 4)
  );

  console.log("\nDraft saved.");
  console.log(`Check ./scripts/drafts/${filename}.json`);
}