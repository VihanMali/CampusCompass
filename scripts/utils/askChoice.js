export async function askChoice(rl, message, maxChoice) {

  const answer = await rl.question(message);
  const choice = Number(answer);

  if (Number.isNaN(choice) || choice < 0 || choice > maxChoice) {
    throw new Error("Invalid choice.");
  }

  return choice;
}