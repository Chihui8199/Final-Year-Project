import { read } from '../../../db/neo4j';
import axios from 'axios';
import verifyJWT from '../../../middlewares/verifyJWT';
import withMiddleware from '../../../utils/middleware/withMiddleware';

const handler = async (req, res) => {
    try {
        const reccURL = 'https://recommendation-ml-401105.de.r.appspot.com/recommend';
        const { user_id, strategy_type } = req.query;

        const params = {
            user_id: user_id,
            strategy_type: strategy_type,
        };

        const response = await axios.get(reccURL, { params });
        const reccJobID = response?.data?.recommendations.map((item) => item[0]);

        // Fetch job details from database
        const query = `
        MATCH (job:Job)-[:HAS_JOB_DESCRIPTION]->(jd:JobDescription)
        MATCH (job)-[:HAS_JOB_TASK]->(jt:JobTasks)
        WHERE job.jobid IN $reccJobID
        WITH job, jd.\`Job Role Description\` AS jobRoleDescription, COLLECT(properties(jt).\`Key Tasks\`) AS keyTasksList
        RETURN job, jobRoleDescription, keyTasksList
      `;

        const result = await read(query, { reccJobID });
        const finalRes = formatData(result, response?.data?.recommendations);

        // Send the response back to the client
        res.status(200).json(finalRes);
    } catch (error) {
        console.error('Error calling the recommendation API:', error.message);
        res.status(error.response?.status || 500).json(error.response?.data || 'Internal Server Error');
    }
};

const formatData = (result, similarityValues) => {
  const finalRes = result.records
    .map((record) => record.toObject())
    .map(({ job, jobRoleDescription, keyTasksList }) => {
      let similarityVal = similarityValues.find(
        (subArray) => subArray[0] === job.properties.jobid.low,
      );
      similarityVal = similarityVal?.[1];

      return {
        jobId: job.properties.jobid.low,
        sector: job.properties.Sector,
        jobRole: job.properties['Job Role'],
        track: job.properties.Track,
        similarity: similarityVal,
        jobRoleDescription,
        keyTasksList,
      };
    });
  finalRes.sort((a, b) => b.similarity - a.similarity);

  return finalRes;
};

export default withMiddleware(verifyJWT)(handler);
