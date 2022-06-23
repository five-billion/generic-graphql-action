const fs = require("fs");
const { inspect } = require("util");
const yaml = require("js-yaml");
const core = require("@actions/core");
const { request } = require("graphql-request");

function getAllInputs() {
  return Object.entries(process.env).reduce((result, [key, value]) => {
    if (!/^INPUT_/.test(key)) return result;

    const inputName = key.replace(/^INPUT_/, "").toLowerCase();

    // The js-yaml parser cannot handle the syntax of a multi-line GraphQL query very well,
    // so we just leave it as-is.
    // https://github.com/octokit/graphql-action/issues/21
    if (inputName === `query`) {
      result.query = value;
      return result;
    }

    result[inputName] = yaml.load(value);

    return result;
  }, {});
}

async function main() {
  try {
    const { query, api_endpoint, variables, headers, output } = getAllInputs();

    core.info(query);

    const time = Date.now();
    const data = await request(api_endpoint, query, variables, headers);

    core.info(`< 200 ${Date.now() - time}ms`);
    core.setOutput("data", data.channels);

    fs.writeFileSync(output, JSON.stringify(data, null, 2));
  } catch (error) {
    core.debug(inspect(error));
    core.setFailed(error.message);
  }
}

main();
