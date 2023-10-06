import { read } from '../../../db/neo4j';
import verifyJWT from '../../../middlewares/verifyJWT';
import withMiddleware from '../../../utils/middleware/withMiddleware';

const handler = async (req, res) => {
  try {
    const { email } = req.query;

    const query = `
        MATCH (user:User {email: $email})-[:HAS_LEARNER_PROFILE]->(learner:LearnerProfile)
        OPTIONAL MATCH (learner)-[:HAS_TARGET_JOB_ROLE]->(desiredJob:Job)
        OPTIONAL MATCH (learner)-[:HAS_CUR_JOB]->(currentJob:Job)
        OPTIONAL MATCH (learner)-[:HAS_PREV_JOB]->(previousJobs:Job)
        WITH user, learner, properties(learner) AS learnerProperties,
            collect(DISTINCT properties(desiredJob)) AS desiredJobProperties,
            collect(DISTINCT properties(currentJob)) AS currentJobProperties,
            collect(DISTINCT properties(previousJobs)) AS previousJobProperties
        RETURN properties(user) as user, COLLECT({
          learnerProfiles: learnerProperties,
          desiredJobs: desiredJobProperties,
          currentJobs: currentJobProperties,
          previousJobs: previousJobProperties
        }) AS learnerProfiles;
        `;

    const result = await read(query, { email });
    const finalData = formatData(result);

    res.status(200).json(finalData[0]);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).send('Internal server error');
  }
};

const formatData = (result) => {
  return result.records.map((record) => {
    const user = record.get('user');

    const learnerProfiles = record.get('learnerProfiles').map((profile) => {
      return {
        uuid: profile.learnerProfiles.uuid,
        desiredJobs: profile.desiredJobs.map((job) => ({
          JobRole: job['Job Role'],
          Sector: job.Sector,
          Track: job.Track,
        })),
        currentJobs: profile.currentJobs.map((job) => ({
          JobRole: job['Job Role'],
          Sector: job.Sector,
          Track: job.Track,
        })),
        previousJobs: profile.previousJobs.map((job) => ({
          JobRole: job['Job Role'],
          Sector: job.Sector,
          Track: job.Track,
        })),
      };
    });

    return { user, learnerProfiles };
  });
};

export default withMiddleware(verifyJWT)(handler);
