async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`(${response.status}): ${response.statusText}`);
    }
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Unexpected token < in JSON
      console.log("There was a SyntaxError", error.message);
    } else {
      console.log("Oops something wrong:", error.message);
    }
  }
}
export default fetchData;
