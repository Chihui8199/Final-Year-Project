import { read } from '../../../db/neo4j'

export default async function handler(req, res) {
  const { email } = req.query

  const query = `
  MATCH (u:User {email: ${email}})
  WITH u.state AS learnerState
  
  MATCH (lp:LearnerProfile) WHERE lp.uuid = learnerState
  
  MATCH (lp)-[:HAS_TARGET_JOB_ROLE]->(j:Job)
  WITH lp, j.jobid AS desiredJobID, j.\`Job Role\` AS jobRole
  
  MATCH (j)-[:REQUIRE_TECHNICAL_SKILL]->(jt:JobTSC)-[:HAS_TSC_KEY]->(k:TSCKey)
  WHERE j.jobid = desiredJobID
  WITH lp, jobRole, 
      jt, k,
      jt.\`TSC Key ID\` AS TSCKeyID,
      k.\`TSC Title\` AS title,
      jt.\`Proficiency Level\` AS jobProficiencyLevel
  ORDER BY TSCKeyID DESC
  
  WITH lp, jobRole, COLLECT({TSCKeyID: TSCKeyID, proficiency: jobProficiencyLevel}) AS requiredProficiencies
  UNWIND requiredProficiencies AS proficiencyData
  
  MATCH (n:TSCProficiency)
  WHERE n.\`TSC Key ID\` = proficiencyData.TSCKeyID
  WITH lp, jobRole, 
      n.\`TSC Key ID\` AS tscKeyID,
      n.\`Proficiency Level\` AS proficiencyLevel,
      n.\`Knowledge\` AS knowledgeDetails,
      n.\`Ability\` AS abilityDetails,
      n.\`Proficiency Description\` AS proficiencyDescription,
      proficiencyData.proficiency AS jobProficiency
  
  WITH lp, jobRole, 
      tscKeyID, 
      proficiencyLevel, 
      jobProficiency, 
      COLLECT(DISTINCT knowledgeDetails) AS distinctKnowledge,
      COLLECT(DISTINCT abilityDetails) AS distinctAbility,
      COLLECT(DISTINCT proficiencyDescription) AS distinctDescription
  
  WITH lp, jobRole, 
      tscKeyID, 
      proficiencyLevel, 
      jobProficiency, 
      [x IN distinctKnowledge WHERE x IS NOT NULL | x] AS filteredKnowledge,
      [x IN distinctAbility WHERE x IS NOT NULL | x] AS filteredAbility,
      [x IN distinctDescription WHERE x IS NOT NULL | x] AS filteredDescription
  
  OPTIONAL MATCH (lp)-[r:HAS_TECHNICAL_SKILLS]->(s:TSCProficiency)
  WHERE s.\`TSC Key ID\` = tscKeyID
  WITH jobRole, tscKeyID, jobProficiency,
       CASE WHEN s IS NOT NULL THEN s.\`Proficiency Level\` ELSE -1 END AS userProficiency,
       proficiencyLevel, filteredKnowledge, filteredAbility, filteredDescription
  
  WITH jobRole,
      tscKeyID, 
      jobProficiency, 
      userProficiency,
      COLLECT(DISTINCT {proficiencyLevel: proficiencyLevel, filteredKnowledge: filteredKnowledge, filteredAbility: filteredAbility, filteredDescription: filteredDescription}) AS proficiencyDetails
  
  MATCH (t:TSCKey) 
  WHERE t.\`TSC Key ID\` = tscKeyID
  
  RETURN 
      t, 
      tscKeyID, 
      jobProficiency, 
      userProficiency, 
      proficiencyDetails,
      jobRole;
  `;
  

  const result = await read(query, { email })
  const finalData = formatData(result)

  res.status(200).json(finalData)
}

const formatData = result => {
  const finalRes = result.records
    .map(record => record.toObject())
    .map(item => ({
      jobTitle: item.jobRole,
      tscKeyID: item?.tscKeyID?.low,
      proficiencyDetails: item?.proficiencyDetails
        .map(detail => {
          return {
            proficiencyLevel: detail.proficiencyLevel.low,
            filteredKnowledge: detail?.filteredKnowledge.filter(knowledge => !!knowledge),
            filteredAbility: detail?.filteredAbility.filter(ability => !!ability),
            filteredDescription: detail?.filteredDescription.filter(description => !!description)
          }
        })
        .sort((a, b) => a.proficiencyLevel - b.proficiencyLevel),
      tscDescrip: item.t.properties['TSC Description'],
      tscCategory: item.t.properties['TSC Category'],
      tscTitle: item.t.properties['TSC Title'],
      jobRequiredProficiency: item.jobProficiency.low,
      userAcquiredProficiency: item.userProficiency.low
    }))
  
return finalRes;
}

