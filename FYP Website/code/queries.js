const neo4j = require('neo4j-driver');

async function main() {
  //const { AURA_CONNECTION_URI, AURA_USERNAME, AURA_PASSWORD } = process.env;
  console.log(process.env.AURA_CONNECTION_URI)
  console.log(AURA_CONNECTION_URI, AURA_USERNAME, AURA_PASSWORD)
  //const driver = neo4j.driver(AURA_CONNECTION_URI, neo4j.auth.basic(AURA_USERNAME, AURA_PASSWORD));
  console.log("Connected to Neo4j Aura!");
  //const session = driver.session();

  // Your script logic here...

  // Close the Neo4j driver when done
  //await driver.close();
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
