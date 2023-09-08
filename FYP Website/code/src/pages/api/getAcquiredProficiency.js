import { read } from '../../lib/neo4j'

// TODO: change the jobID and the userId to what is being passed in
export default async function handler(req, res) {
  //const queryParams = req.query
  const query = `
  // Fetch required technical skills for a specific job
  MATCH (j:Job)-[:REQUIRE_TECHNICAL_SKILL]->(jt:JobTSC)-[:HAS_TSC_KEY]->(k:TSCKey)
  WHERE j.jobid = 1251
  WITH DISTINCT 
       jt.\`TSC Key ID\` AS TSCKeyID,
       k.\`TSC Title\` AS title,
       jt.\`Proficiency Level\` AS jobProficiencyLevel
  ORDER BY TSCKeyID DESC
  
  // Collect distinct TSC Key IDs and their proficiency levels
  WITH COLLECT({TSCKeyID: TSCKeyID, proficiency: jobProficiencyLevel}) AS requiredProficiencies
  UNWIND requiredProficiencies AS proficiencyData
  
  // Fetch proficiency details for the TSC Key IDs
  MATCH (n:TSCProficiency)
  WHERE n.\`TSC Key ID\` = proficiencyData.TSCKeyID
  WITH 
       n.\`TSC Key ID\` AS tscKeyID,
       n.\`Proficiency Level\` AS proficiencyLevel,
       n.\`Knowledge\` AS knowledge,
       proficiencyData.proficiency AS jobProficiency
  
  // Group by keys and collect distinct knowledge
  WITH 
       tscKeyID, 
       proficiencyLevel, 
       jobProficiency, 
       COLLECT(DISTINCT knowledge) AS distinctAbility
  
  // Filter out null values from knowledge
  WITH 
       tscKeyID, 
       proficiencyLevel, 
       jobProficiency, 
       [x IN distinctAbility WHERE x IS NOT NULL | x] AS filteredKnowledge
  
  // Check for learner's proficiency level in the skill
  OPTIONAL MATCH (lp:LearnerProfile)-[r:HAS_TECHNICAL_SKILLS]->(n)
  WHERE r.\`TSC Key ID\` = tscKeyID
  WITH 
       tscKeyID,
       jobProficiency,
       CASE WHEN lp IS NOT NULL THEN r.\`Proficiency Level\` ELSE -1 END AS userProficiency,
       proficiencyLevel,
       filteredKnowledge
  
  // Collect proficiency details
  WITH 
       tscKeyID, 
       jobProficiency, 
       userProficiency,
       COLLECT(DISTINCT {proficiencyLevel: proficiencyLevel, filteredKnowledge: filteredKnowledge}) AS proficiencyLevels
  
  // Fetch the corresponding TSC Key details
  MATCH (t:TSCKey) 
  WHERE t.\`TSC Key ID\` = tscKeyID
  
  RETURN 
       t, 
       tscKeyID, 
       jobProficiency, 
       userProficiency, 
       proficiencyLevels;
  
`
  const result = await read(query)
  const finalData = formatData(result)

  res.status(200).json(finalData)
}

// TODO: rename filteredKnowledge to fitleredAbility
const formatData = result => {
  const finalRes = result.records
    .map(record => record.toObject())
    .map(item => ({
      tscKeyID: item?.tscKeyID?.low,
      proficiencyLevel: item?.proficiencyLevels.map(ability => {
        return {
          proficiencyLevel: ability.proficiencyLevel.low,
          filteredAbility: ability?.filteredKnowledge.filter(ability => !!ability)
        };
      }).sort((a, b) => a.proficiencyLevel - b.proficiencyLevel),
      tscDescrip: item.t.properties['TSC Description'],
      tscCategory: item.t.properties['TSC Category'],
      tscTitle: item.t.properties['TSC Title'],
      jobRequiredProficiency: item.jobProficiency.low,
      userAcquiredProficiency: item.userProficiency.low
    }))
  return finalRes
}
