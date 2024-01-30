import User from "./User.js";
import authMenu from "./menus/authMenu.js";
import mainMenu from "./menus/mainMenu.js";

export const API_URL = "http://localhost:1337/api";

export const myUser = new User();

export const USERNAME_MAX_LENGTH = 10;
export const LOADING_DELAY = 1000; //milliseconds

export const PRESS_KEY_TO_CONTINUE = "Press any key to continue...";
export const PRESS_KEY_TO_BACK = "Press any key to back...";
export const ERROR_MESSAGE = "Error message:";

export const nominals = [50000, 100000];

await runATM();

async function runATM() {
  const isSucceed = await authMenu();
  if (!isSucceed) {
    return;
  }
  await mainMenu();
}
