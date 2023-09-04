const neo4j = require('neo4j-driver')
// TODO: remove later
const fs = require('fs') // Import the file system module

// TODO: Fix errors in the environment variables not looading correctly
const AURA_CONNECTION_URI = 'neo4j+s://5a980a50.databases.neo4j.io'
const AURA_USERNAME = 'neo4j'
const AURA_PASSWORD = 'Fat4vMlGTgvjEJGwkRl24DE9BYgKeQtYjvUGgo8p2R4'

const driver = neo4j.driver(AURA_CONNECTION_URI, neo4j.auth.basic(AURA_USERNAME, AURA_PASSWORD))

async function read(cypher, params = {}) {
  // 1. Open a session
  const session = driver.session()

  try {
    // 2. Execute a Cypher Statement
    const res = await session.executeRead(tx => tx.run(cypher, params))
   // 3. Write the result to a file
   const values = await res.records.map(record => record.toObject())
   const results = await res.records.map(record => record.toObject()).map(item => ({
      tscKeyID: item?.tscKeyID?.low,
      proficiencyLevel: item?.proficiencyLevels.map(knowledge=> {
        return {
          proficiencyLevel: knowledge.proficiencyLevel.low,
          filteredKnowledge: knowledge.filteredKnowledge.filter(knowledge => !!knowledge)
        }
      }),
      tscDescrip: item.t.properties['TSC Description'],
      tscCategory: item.t.properties['TSC Category'],
      tscTitle: item.t.properties['TSC Title'],
   }))
   console.log(results)
  
   const resultString = JSON.stringify(results, null, 2); // Convert the result to a pretty-printed JSON string
   fs.writeFileSync('abc.json', resultString);
    return res
  } finally {
    // 4. Close the session
    await session.close()
  }
}

// Define the Cypher query
// Define the parameter
//RETRIEVE ALL TSC KEY IDS by passing in the jobs and getting the unique TSC Key IDs for all jobs passed in
const tscKeyIDs = [1, 2, 3];
const query = `
MATCH (j:Job)-[:REQUIRE_TECHNICAL_SKILL]->(jt:JobTSC)-[:HAS_TSC_KEY]->(k:TSCKey)
WHERE j.jobid IN [1375, 1038, 757]
WITH jt.\`TSC Key ID\` AS TSCKeyID, k.\`TSC Title\` AS title
ORDER BY TSCKeyID DESC

WITH COLLECT(DISTINCT TSCKeyID) AS requiredProficiency // Doesn't care what level of prof first
MATCH (n:TSCProficiency)
WHERE n.\`TSC Key ID\` IN requiredProficiency

WITH n.\`TSC Key ID\` AS tscKeyID, n.\`Proficiency Level\` AS proficiencyLevel, COLLECT(DISTINCT n.\`Knowledge\`) AS distinctKnowledge

// Group by TSC Key ID and Proficiency Level
WITH tscKeyID, proficiencyLevel, [x IN distinctKnowledge WHERE x IS NOT NULL | x] AS filteredKnowledge

// Collect results by TSC Key ID
WITH tscKeyID, COLLECT({proficiencyLevel: proficiencyLevel, filteredKnowledge: filteredKnowledge}) AS proficiencyLevels

MATCH (t:TSCKey) WHERE t.\`TSC Key ID\` = tscKeyID
RETURN t, tscKeyID, proficiencyLevels;
`;
read(query)