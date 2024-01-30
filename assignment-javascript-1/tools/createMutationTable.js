import { table } from "table";
import numberInRupiahFormat from "./numberInRupiahFormat.js";

function createMutationTable(mutations) {
  let mutationTable = [["Date", "Type", "Amount"]];
  for (let mutation of mutations) {
    let date = new Date(mutation.createdAt);

    mutationTable.push([
      date.toLocaleDateString("en-GB").replaceAll("/", "-"),
      mutation.type,
      numberInRupiahFormat(
        mutation.amount < 0 ? -mutation.amount : mutation.amount
      ),
    ]);
  }

  const tableConfig = {
    border: {
      topBody: ``,
      topJoin: ``,
      topLeft: ``,
      topRight: ``,

      bottomBody: ``,
      bottomJoin: ``,
      bottomLeft: ``,
      bottomRight: ``,

      bodyLeft: ``,
      bodyRight: ``,
      bodyJoin: `│`,

      joinBody: ``,
      joinLeft: ``,
      joinRight: ``,
      joinJoin: ``,
    },
    drawHorizontalLine: () => false,
  };
  return table(mutationTable, tableConfig);
}

export default createMutationTable;
