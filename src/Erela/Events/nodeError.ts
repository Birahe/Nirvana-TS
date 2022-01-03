import chalk from "chalk";
import Client from "../../Client";
module.exports = (client: Client) => {
  client.manager.on("nodeError", (node, error) =>
    console.error(
      chalk.magenta(
        `Node ${chalk.cyan(node.options.identifier)} hata aldı: ${chalk.red(
          error.message
        )}`
      )
    )
  );
};
