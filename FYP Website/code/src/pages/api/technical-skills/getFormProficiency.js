import { read } from '../../../db/neo4j';
import verifyJWT from '../../../middlewares/verifyJWT';
import withMiddleware from '../../../utils/middleware/withMiddleware';

const handler = async (req, res) => {
  try {
    const { desiredJobIDs, pastJobIDs } = req.query;

    const query = `
    // Start with your desired job
    MATCH (j)-[:REQUIRE_TECHNICAL_SKILL]->(jt:JobTSC)-[:HAS_TSC_KEY]->(k:TSCKey)
    WHERE j.jobid IN [${desiredJobIDs}]
    WITH jt.\`TSC Key ID\` AS TSCKeyID, jt.\`Proficiency Level\` AS jobProficiencyLevel
    ORDER BY TSCKeyID DESC

    // Now, find other jobs with overlapping TSCKeyID
    OPTIONAL MATCH (j2)-[:REQUIRE_TECHNICAL_SKILL]->(jt2:JobTSC)-[:HAS_TSC_KEY]->(k2:TSCKey)
    WHERE j2.jobid IN [${pastJobIDs}] AND jt2.\`TSC Key ID\` = TSCKeyID
    WITH 
        TSCKeyID, 
        jobProficiencyLevel,
        COLLECT(jt2.\`Proficiency Level\`) AS otherJobProficiencies

    // Calculate the max proficiency for the desired job, based on overlapping keys
    WITH 
        TSCKeyID, 
        CASE 
            WHEN SIZE(otherJobProficiencies) > 0 THEN REDUCE(maxProf = 0, p IN otherJobProficiencies | CASE WHEN p > maxProf THEN p ELSE maxProf END)
            ELSE 7
        END AS newProficiencyLevel

    MATCH (n:TSCProficiency)
    WHERE n.\`TSC Key ID\` = TSCKeyID

    // Aggregating distinct knowledge, ability, and description details
    WITH 
        TSCKeyID,
        newProficiencyLevel AS jobProficiency,
        COLLECT(DISTINCT n.\`Knowledge\`) AS aggregatedKnowledge,
        COLLECT(DISTINCT n.\`Ability\`) AS aggregatedAbility,
        COLLECT(DISTINCT n.\`Proficiency Description\`) AS aggregatedDescription,
        n.\`Proficiency Level\` AS proficiencyLevel

    WITH 
        TSCKeyID, 
        jobProficiency,
        {
            proficiencyLevel: proficiencyLevel,
            filteredKnowledge: [x IN aggregatedKnowledge WHERE x IS NOT NULL],
            filteredAbility: [x IN aggregatedAbility WHERE x IS NOT NULL],
            filteredDescription: [x IN aggregatedDescription WHERE x IS NOT NULL]
        } AS proficiencyDetail

    // Aggregating proficiency details for each TSCKeyID
    WITH 
        TSCKeyID,
        jobProficiency,
        COLLECT(proficiencyDetail) AS proficiencyDetails

    MATCH (t:TSCKey) 
    WHERE t.\`TSC Key ID\` = TSCKeyID

    RETURN 
        t AS TSCKeyDetails, 
        TSCKeyID, 
        jobProficiency, 
        proficiencyDetails
`;

    const result = await read(query);
    const finalResult = formatResult(result);
    res.status(200).json(finalResult);
  } catch (error) {
    console.error('Error fetching proficiency details:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const formatResult = (result) => {
  const data = result.records
    .map((record) => record.toObject())
    .map((item) => {
      return {
        TSCKeyDetails: item.TSCKeyDetails.properties,
        TSCKeyID: item.TSCKeyID.low,
        jobProficiency: item.jobProficiency.low,
        proficiencyDetails: item.proficiencyDetails
          .map((detail) => {
            const cleanedDescription =
              detail.filteredDescription.filter(Boolean);
            const cleanedAbility = detail.filteredAbility.filter(Boolean);
            const cleanedKnowledge = detail.filteredKnowledge.filter(Boolean);

            return {
              filteredDescription: cleanedDescription,
              filteredAbility: cleanedAbility,
              filteredKnowledge: cleanedKnowledge,
              proficiencyLevel: detail.proficiencyLevel.low,
            };
          })
          .sort((a, b) => a.proficiencyLevel - b.proficiencyLevel),
      };
    });

  return data;
};

export default withMiddleware(verifyJWT)(handler);
