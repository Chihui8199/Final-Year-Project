import { write } from '../../db/neo4j'

export default async function handler(req, res) {
  const { email, data } = req.body
  let { prevJobs, curJobRole, targetJobRole } = req.body

  // Ensure prevJobs is an array and contains integers
  prevJobs = Array.isArray(prevJobs) ? prevJobs.map(job => parseInt(job, 10)) : [parseInt(prevJobs, 10)]

  // Convert curJobRole and targetJobRole to integers
  curJobRole = parseInt(curJobRole, 10)
  targetJobRole = parseInt(targetJobRole, 10)

  const query = `
      MATCH (user:User {email: $email})
      CREATE (learner:LearnerProfile {
          uuid: toString(datetime()) + "-" + user.email,
          createdTimestamp: datetime()
      })
      MERGE (user)-[:HAS_LEARNER_PROFILE]->(learner)
      SET user.state = learner.uuid

      WITH user, learner
      MATCH (prevJob:Job) WHERE prevJob.jobid IN $prevJobs
      MATCH (curJob:Job {jobid: $currentJobId})
      MATCH (targetJobRole:Job {jobid: $targetJobRoleId})
      CREATE (learner)-[:HAS_PREV_JOB]->(prevJob)
      CREATE (learner)-[:HAS_CUR_JOB]->(curJob)
      CREATE (learner)-[:HAS_TARGET_JOB_ROLE]->(targetJobRole)

      WITH learner
      UNWIND $proficiencyData AS data
      OPTIONAL MATCH (proficiency:TSCProficiency {\`TSC Key ID\`: data.tscKey, \`Proficiency Level\`: data.profLevel})
      WITH learner, proficiency
      WHERE proficiency IS NOT NULL
      MERGE (learner)-[:HAS_PROFICIENCY]->(proficiency)
      RETURN learner
`

  const result = await write(query, {
    email: email,
    prevJobs: prevJobs,
    currentJobId: curJobRole,
    targetJobRoleId: targetJobRole,
    proficiencyData: data
  })
  res.status(200).json({ message: 'Success', result })
}
