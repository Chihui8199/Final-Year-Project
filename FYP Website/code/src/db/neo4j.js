const neo4j = require('neo4j-driver')

const {AURA_CONNECTION_URI, AURA_USERNAME, AURA_PASSWORD} = process.env

const driver = neo4j.driver(AURA_CONNECTION_URI, neo4j.auth.basic(AURA_USERNAME, AURA_PASSWORD))

export async function read(cypher, params = {}) {
  // 1. Open a session
  const session = driver.session()

  try {
    // 2. Execute a Cypher Statement
    const res = await session.executeRead(tx => tx.run(cypher, params))
    return res
  } finally {
    // 4. Close the session
    await session.close()
  }
}

export async function write(cypher, params = {}) {
  const session = driver.session()
  try {
    const res = await session.executeWrite(tx => tx.run(cypher, params))
    return res
  } finally {
    await session.close()
  }
}
