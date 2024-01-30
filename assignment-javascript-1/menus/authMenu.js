import {
  ERROR_MESSAGE,
  LOADING_DELAY,
  PRESS_KEY_TO_CONTINUE,
  myUser,
} from "../index.js";
import askingInput from "../tools/askingInput.js";
import { clearScreen, printLoading } from "../tools/toolsCLI.js";
import { checkUserInput } from "../tools/toolsCheckInput.js";
import waitForKeyPress from "../tools/waitForKeyPress.js";

async function authMenu() {
  let isKeepAskingInput = true;
  let isRegisterSucceed = false;
  let isLoginSucceed = false;
  let isInputCorrected = false;

  clearScreen();

  let userInput = await askingInput(
    "Welcome to DIGI ATM\nMenu:\n1. Register\n2. Login\nInput: "
  );
  printLoading(LOADING_DELAY);
  let data, errorInput, menuOption;
  while (isKeepAskingInput || (isRegisterSucceed && !isLoginSucceed)) {
    isInputCorrected = false;
    isRegisterSucceed = false;
    isLoginSucceed = false;

    switch (userInput) {
      case "1":
        menuOption = "Register";
      case "2":
        if (userInput == "2") {
          menuOption = "Login";
        }
        data = await inputUserData(menuOption);

        printLoading(LOADING_DELAY);
        errorInput = checkUserInput(data);
        if (errorInput) {
          process.stdout.write(errorInput);
          await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
          break;
        }
        isInputCorrected = true;

        switch (menuOption) {
          case "Register":
            isRegisterSucceed = await myUser.register(JSON.stringify(data));
            break;
          case "Login":
            isLoginSucceed = await myUser.login(JSON.stringify(data));
            break;
        }
        if (!isRegisterSucceed && !isLoginSucceed) {
          await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
          break;
        }
        isKeepAskingInput = menuOption === "Register" ? true : false;
        break;
      case "x": //hidden exit input
        return;
      default:
        clearScreen();
        console.log(`${ERROR_MESSAGE} Invalid menu input`);
        await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
        isKeepAskingInput = true;
        isInputCorrected = true;
        break;
    }
    clearScreen();
    if (isKeepAskingInput && isInputCorrected && !isLoginSucceed) {
      userInput = await askingInput(
        "Welcome to DIGI ATM\nMenu:\n1. Register\n2. Login\nInput: "
      );
    }
  }
  return isRegisterSucceed || isLoginSucceed;
}

async function inputUserData(menu) {
  let keys, keyNormalString, keysRearranged;
  switch (menu) {
    case "Register":
      keys = ["username", "account_number", "pin"];
      keysRearranged = ["username", "pin", "account_number"];
      keyNormalString = ["Username", "Account number", "Pin"];
      break;
    case "Login":
      keys = ["username", "pin"];
      keysRearranged = keys;
      keyNormalString = ["Username", "Pin"];
      break;
    default: //never run
      break;
  }

  let data = await askingInputs(menu, keys, keyNormalString);
  let bodyData = rearrangeData(data, keysRearranged);
  return bodyData;
}

async function askingInputs(menu, keys, keyNormalString) {
  const data = {};
  for (let i = 0; i < keys.length; i++) {
    clearScreen();
    console.log(menu);
    data[keys[i]] = await askingInput(`${keyNormalString[i]}: `);
  }
  return data;
}

function rearrangeData(originalData, keysRearranged) {
  const bodyData = { data: {} };
  for (let key of keysRearranged) {
    bodyData.data[key] = originalData[key];
  }
  return bodyData;
}

export default authMenu;
