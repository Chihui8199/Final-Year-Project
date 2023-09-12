import { read } from '../../db/neo4j'

export default async function handler(req, res) {
  const { email } = req.query
  const query = `
  MATCH (u:User {email: "isabelle@vincere.health"})
  WITH u.state AS learnerState
  
  // Fetch the LearnerProfile based on the state property of the User
  MATCH (lp:LearnerProfile) WHERE lp.uuid = learnerState
  
  // Fetch the desired jobID for the LearnerProfile
  MATCH (lp)-[:HAS_TARGET_JOB_ROLE]->(j:Job)
  WITH j, j.jobid AS desiredJobID, j.\`Job Role\` AS jobRole
  
  // Fetch required technical skills for the desired job
  MATCH (j)-[:REQUIRE_TECHNICAL_SKILL]->(jt:JobTSC)-[:HAS_TSC_KEY]->(k:TSCKey)
  WHERE j.jobid = desiredJobID
  WITH jobRole, 
      jt, k,
      jt.\`TSC Key ID\` AS TSCKeyID,
      k.\`TSC Title\` AS title,
      jt.\`Proficiency Level\` AS jobProficiencyLevel
  ORDER BY TSCKeyID DESC
  
  // Collect distinct TSC Key IDs and their proficiency levels
  WITH jobRole, COLLECT({TSCKeyID: TSCKeyID, proficiency: jobProficiencyLevel}) AS requiredProficiencies
  UNWIND requiredProficiencies AS proficiencyData
  
  // Fetch proficiency details for the TSC Key IDs
  MATCH (n:TSCProficiency)
  WHERE n.\`TSC Key ID\` = proficiencyData.TSCKeyID
  WITH jobRole, 
      n.\`TSC Key ID\` AS tscKeyID,
      n.\`Proficiency Level\` AS proficiencyLevel,
      n.\`Knowledge\` AS knowledge,
      proficiencyData.proficiency AS jobProficiency
  
  // Group by keys and collect distinct knowledge
  WITH jobRole, 
      tscKeyID, 
      proficiencyLevel, 
      jobProficiency, 
      COLLECT(DISTINCT knowledge) AS distinctAbility
  
  // Filter out null values from knowledge
  WITH jobRole, 
      tscKeyID, 
      proficiencyLevel, 
      jobProficiency, 
      [x IN distinctAbility WHERE x IS NOT NULL | x] AS filteredKnowledge
  
  // Check for learner's proficiency level in the skill
  OPTIONAL MATCH (lp:LearnerProfile)-[r:HAS_TECHNICAL_SKILLS]->(n)
  WHERE r.\`TSC Key ID\` = tscKeyID
  WITH jobRole, 
      tscKeyID,
      jobProficiency,
      CASE WHEN lp IS NOT NULL THEN r.\`Proficiency Level\` ELSE -1 END AS userProficiency,
      proficiencyLevel,
      filteredKnowledge
  
  // Collect proficiency details
  WITH jobRole,
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
      proficiencyLevels,
      jobRole;
  `

  // Now you can use the 'query' constant in your JavaScript program

  const result = await read(query, { email })
  const finalData = formatData(result)

  res.status(200).json(finalData)
}

// TODO: rename filteredKnowledge to fitleredAbility
const formatData = result => {
  const finalRes = result.records
    .map(record => record.toObject())
    .map(item => ({
      jobTitle: item.jobRole,
      tscKeyID: item?.tscKeyID?.low,
      proficiencyLevel: item?.proficiencyLevels
        .map(ability => {
          return {
            proficiencyLevel: ability.proficiencyLevel.low,
            filteredAbility: ability?.filteredKnowledge.filter(ability => !!ability)
          }
        })
        .sort((a, b) => a.proficiencyLevel - b.proficiencyLevel),
      tscDescrip: item.t.properties['TSC Description'],
      tscCategory: item.t.properties['TSC Category'],
      tscTitle: item.t.properties['TSC Title'],
      jobRequiredProficiency: item.jobProficiency.low,
      userAcquiredProficiency: item.userProficiency.low
    }))
  return finalRes
}
