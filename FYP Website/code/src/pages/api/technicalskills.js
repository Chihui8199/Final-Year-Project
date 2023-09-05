import { read } from '../../lib/neo4j'

// TODO:takes in all prevJob and curJob of user
export default async function handler(req, res) {
  const queryParams = req.query
  const query = `
  MATCH (j:Job)-[:REQUIRE_TECHNICAL_SKILL]->(jt:JobTSC)-[:HAS_TSC_KEY]->(k:TSCKey)
  WHERE j.jobid IN [${queryParams['ids']}] 
  WITH jt.\`TSC Key ID\` AS TSCKeyID, k.\`TSC Title\` AS title
  ORDER BY TSCKeyID DESC
  
  WITH COLLECT(DISTINCT TSCKeyID) AS requiredProficiency // Doesn't care what level of prof first
  MATCH (n:TSCProficiency)
  WHERE n.\`TSC Key ID\` IN requiredProficiency
  
  WITH n.\`TSC Key ID\` AS tscKeyID, n.\`Proficiency Level\` AS proficiencyLevel, COLLECT(DISTINCT n.\`Ability\`) AS distinctAbility
  
  // Group by TSC Key ID and Proficiency Level
  WITH tscKeyID, proficiencyLevel, [x IN distinctAbility WHERE x IS NOT NULL | x] AS filteredAbility
  
  // Collect results by TSC Key ID
  WITH tscKeyID, COLLECT({proficiencyLevel: proficiencyLevel, filteredAbility: filteredAbility}) AS proficiencyLevels
  
  MATCH (t:TSCKey) WHERE t.\`TSC Key ID\` = tscKeyID
  RETURN t, tscKeyID, proficiencyLevels;
  `
  const result = await read(query)
  const finalRes = result.records
    .map(record => record.toObject())
    .map(item => ({
      tscKeyID: item?.tscKeyID?.low,
      proficiencyLevel: item?.proficiencyLevels.map(ability => {
        return {
          proficiencyLevel: ability.proficiencyLevel.low,
          filteredAbility: ability.filteredAbility.filter(ability => !!ability)
        }
      }),
      tscDescrip: item.t.properties['TSC Description'],
      tscCategory: item.t.properties['TSC Category'],
      tscTitle: item.t.properties['TSC Title']
    }))

  res.status(200).json({ data: finalRes })
}
