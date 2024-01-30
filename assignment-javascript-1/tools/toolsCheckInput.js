import { ERROR_MESSAGE, USERNAME_MAX_LENGTH } from "../index.js";
import numberInRupiahFormat from "./numberInRupiahFormat.js";

function checkUserInput(data) {
  let errorMsg = "";

  for (let typeOfInput of Object.keys(data.data)) {
    let value = data.data[typeOfInput];
    switch (typeOfInput) {
      case "username":
        if (value.length > USERNAME_MAX_LENGTH) {
          errorMsg += `${ERROR_MESSAGE} Username should no longer than 10 characters\n`;
        }
        break;
      case "pin":
        if (value.length != 6) {
          errorMsg += `${ERROR_MESSAGE} Pin must contain 6 digit numbers\n`;
        }
        break;
      case "account_number":
        if (!isAccountNumberValid(value)) {
          errorMsg += `${ERROR_MESSAGE} Account number is not valid\n`;
        }
        break;
    }
  }
  return errorMsg;
}

function isNominalInputCorrect(nominalInput, nominals) {
  if (nominalInput === "") {
    return false;
  }
  if (!Number.isInteger(parseInt(nominalInput))) {
    return false;
  }

  if (nominalInput < 1 || nominalInput > nominals.length) {
    return false;
  }
  return true;
}

async function checkAmountInput(myUser, nominal, amount, transactionType) {
  let errorMsg = "";

  if (amount === "") {
    return `${ERROR_MESSAGE} Invalid menu input\n`;
  }

  if (transactionType === "Debit" && amount > (await myUser.checkBalance())) {
    errorMsg += `${ERROR_MESSAGE} Your balance is not enough\n`;
  }
  if (amount < 0) {
    errorMsg += `${ERROR_MESSAGE} Amount cannot be negative\n`;
  }
  if (amount % nominal != 0) {
    errorMsg += `${ERROR_MESSAGE} Amount must be the multiples of ${numberInRupiahFormat(
      nominal
    )}\n`;
  }
  return errorMsg;
}

function checkMutationOptions(options) {
  const MAX_MUTATION_OPTIONS = 2;
  let errorMsg = "";
  options = options.split(" ");

  if (options.length != MAX_MUTATION_OPTIONS) {
    errorMsg += `${ERROR_MESSAGE} Please input [type] [order]\n`;
  }
  if (options[1] != "asc" && options[1] != "desc") {
    errorMsg += `${ERROR_MESSAGE} Order must be 'asc' (ascending) or 'desc' (descending)\n`;
  }
  if (options[0] != "CREDIT" && options[0] != "DEBIT" && options[0] != "ALL") {
    errorMsg += `${ERROR_MESSAGE} Type must be 'CREDIT', 'DEBIT', or 'ALL'\n`;
  }
  return errorMsg;
}

function isAccountNumberValid(number) {
  /* Validating account number using Luhn algorithm.
    Original source: https://www.geeksforgeeks.org/luhn-algorithm/ */
  let nDigits = number.length;
  let nSum = 0;
  let isSecond = false;
  for (let i = nDigits - 1; i >= 0; i--) {
    let d = number[i].charCodeAt() - "0".charCodeAt();
    if (isSecond == true) d = d * 2;
    nSum += parseInt(d / 10, 10);
    nSum += d % 10;
    isSecond = !isSecond;
  }
  return nSum % 10 == 0;
}

export {
  checkUserInput,
  isNominalInputCorrect,
  checkAmountInput,
  checkMutationOptions,
  isAccountNumberValid,
};
