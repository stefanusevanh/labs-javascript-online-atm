const waitForKeyPress = async (message) => {
  console.log(message);
  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", function () {
      process.stdin.pause();
      process.stdin.setRawMode(false);
      resolve();
    });
  });
};

export default waitForKeyPress;
