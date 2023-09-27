import { write } from '../../../db/neo4j';

export default async function handler(req, res) {
  const { email, data } = req.body;

  const query = `
    MATCH (Us:User{email: $email})-[hasLearnerProfile:HAS_LEARNER_PROFILE]->(u:LearnerProfile)
    WHERE u.uuid = Us.state
    MATCH (u)-[hasTechnicalSkills:HAS_TECHNICAL_SKILLS]->(t:TSCProficiency)
    DELETE hasTechnicalSkills

    WITH u as learner
    UNWIND $proficiencyData AS data
    OPTIONAL MATCH (proficiency:TSCProficiency {\`TSC Key ID\`: data.tscKeyID, \`Proficiency Level\`: data.profLevel})
    WITH learner, proficiency
    WHERE proficiency IS NOT NULL
    MERGE (learner)-[:HAS_TECHNICAL_SKILLS]->(proficiency)
    RETURN learner
`;

  const result = await write(query, {
    email: email,
    proficiencyData: data,
  });

  res.status(200).json({ message: 'Success', result });
}
