function printLoading(milliseconds) {
  console.log("Loading...");
  delay(milliseconds);
  clearScreen();
}

function delay(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e8; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

function clearScreen() {
  console.clear();
}

export { printLoading, delay, clearScreen };
