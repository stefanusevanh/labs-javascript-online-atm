import { createInterface } from "readline/promises";

export async function askingInput(question) {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const answer = await readline.question(question);
  readline.close();
  return answer;
}

export default askingInput;
