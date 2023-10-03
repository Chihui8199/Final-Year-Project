import { write } from '../../../db/neo4j';

export default async function handler(req, res) {
  const { email, data, newData } = req.body;

  const proficiencyData = findDiff(data, newData);

  const query = `
      MATCH (Us:User{email: $email})-[hasLearnerProfile:HAS_LEARNER_PROFILE]->(u:LearnerProfile)
      WHERE u.uuid = Us.state
      OPTIONAL MATCH (u)-[hasTechnicalSkills:HAS_TECHNICAL_SKILLS]->(t:TSCProficiency)
      DELETE hasTechnicalSkills

      WITH u as learner
      UNWIND $proficiencyData AS data
      MATCH (proficiency:TSCProficiency {\`TSC Key ID\`: data.tscKeyID, \`Proficiency Level\`: data.profLevel})
      WITH learner, proficiency
      WHERE proficiency IS NOT NULL
      MERGE (learner)-[:HAS_TECHNICAL_SKILLS]->(proficiency)
      RETURN learner
  `;

  const result = await write(query, {
    email: email,
    proficiencyData: proficiencyData,
  });
  console.log('new', {
    email: email,
    proficiencyData: proficiencyData,
  });
  res.status(200).json({ message: 'Success', result });
}

const findDiff = (data, finalDefinedProf) => {
  const prev = data.map((item) => {
    let proficiencyValue =
      item.userAcquiredProficiency === -1 ? 7 : item.userAcquiredProficiency;

    return {
      [item.tscKeyID]: proficiencyValue,
    };
  });

  const findDifferences = (arr, obj) => {
    const differences = {};

    arr.forEach((item) => {
      const [key, value] = Object.entries(item)[0];
      if (value !== obj[key]) {
        differences[key] = obj[key];
      }
    });

    return differences;
  };

  const diff = findDifferences(prev, finalDefinedProf);

  const resultList = Object.keys(diff).map((key) => ({
    tscKeyID: parseInt(key),
    profLevel: finalDefinedProf[key],
  }));

  return resultList;
};
