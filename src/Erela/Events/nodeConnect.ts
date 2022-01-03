import chalk from "chalk";
import Client from "../../Client";
module.exports = (client: Client) => {
  client.manager.on("nodeConnect", (node) =>
    console.log(
      chalk.blue(`Node ${chalk.yellow(node.options.identifier)} bağlandı`)
    )
  );
};
