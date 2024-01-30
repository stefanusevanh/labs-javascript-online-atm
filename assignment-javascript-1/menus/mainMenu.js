import {
  ERROR_MESSAGE,
  LOADING_DELAY,
  PRESS_KEY_TO_BACK,
  PRESS_KEY_TO_CONTINUE,
  myUser,
  nominals,
} from "../index.js";
import askingInput from "../tools/askingInput.js";
import { clearScreen, printLoading } from "../tools/toolsCLI.js";
import {
  checkAmountInput,
  checkMutationOptions,
  isNominalInputCorrect,
} from "../tools/toolsCheckInput.js";
import waitForKeyPress from "../tools/waitForKeyPress.js";
import numberInRupiahFormat from "../tools/numberInRupiahFormat.js";
import createMutationTable from "../tools/createMutationTable.js";

async function mainMenu() {
  let isKeepAskingInput = true;
  let transactionType;

  clearScreen();
  let userInput = await askingInput(
    "Welcome to DIGI ATM\nMenu:\n1. Check Balance\n2. Debit\n3. Credit\n4. Check mutation\n5. Exit\nInput: "
  );
  printLoading(LOADING_DELAY);
  while (isKeepAskingInput) {
    let isInputIncorrect = true;
    switch (userInput) {
      case "1":
        clearScreen();
        let balance = await myUser.checkBalance();
        if (balance === "null") {
          await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
          continue;
        }
        console.log(
          `Check balance\nYour balance is ${numberInRupiahFormat(balance)}`
        );
        await waitForKeyPress(PRESS_KEY_TO_BACK);
        break;
      case "2":
        transactionType = "Debit";
      case "3":
        if (userInput == "3") {
          transactionType = "Credit";
        }
        let amountInput;

        clearScreen();
        printNominalMenu(nominals);
        let nominalInput = await askingInput("Input: ");
        printLoading(LOADING_DELAY);
        if (!isNominalInputCorrect(nominalInput, nominals)) {
          console.log(`${ERROR_MESSAGE} Invalid menu input`);
          await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
          continue;
        }
        while (isInputIncorrect) {
          clearScreen();
          amountInput = await askingInput(`${transactionType}\nInput: `);
          printLoading(LOADING_DELAY);

          let errorMsg = await checkAmountInput(
            myUser,
            nominals[nominalInput - 1],
            amountInput,
            transactionType
          );
          if (errorMsg != "") {
            clearScreen();
            process.stdout.write(errorMsg);
            await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
            continue;
          }
          isInputIncorrect = false;
        }

        let isSucceed;
        switch (transactionType) {
          case "Debit":
            isSucceed = await myUser.debit(amountInput);
            break;
          case "Credit":
            isSucceed = await myUser.credit(amountInput);
            break;
        }
        if (!isSucceed) {
          await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
          clearScreen();
          continue;
        }
        clearScreen();
        console.log(`${transactionType} success`);
        await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
        break;
      case "4":
        let mutationOptions;
        while (isInputIncorrect) {
          clearScreen();

          mutationOptions = await askingInput("Input: ");
          let errorMsg = checkMutationOptions(mutationOptions);
          if (errorMsg) {
            process.stdout.write(errorMsg);
            await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
            continue;
          }
          break;
        }

        let mutationData = await myUser.getMutation(mutationOptions);
        if (!mutationData) {
          await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
          clearScreen();
          continue;
        }
        clearScreen();
        console.log(createMutationTable(mutationData.data.transactionList));
        await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
        break;
      case "5":
        console.log("Exiting...");
        return;
      default:
        console.log(`${ERROR_MESSAGE} Invalid menu input`);
        await waitForKeyPress(PRESS_KEY_TO_CONTINUE);
        break;
    }
    if (isKeepAskingInput) {
      clearScreen();
      userInput = await askingInput(
        "Welcome to DIGI ATM\nMenu:\n1. Check Balance\n2. Debit\n3. Credit\n4. Check mutation\n5. Exit\nInput: "
      );
      printLoading(LOADING_DELAY);
    }
  }
}

function printNominalMenu(nominals) {
  console.log("Choose nominal:");
  let i = 1;
  for (let nominal of nominals) {
    console.log(`${i}. ${numberInRupiahFormat(nominal)}`);
    i++;
  }
}

export default mainMenu;
