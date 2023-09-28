import { read } from '../../../db/neo4j';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const reccURL = 'https://recommendation-ml-400402.de.r.appspot.com/recommend';

    const { user_id, strategy_type } = req.query;

    const params = {
      user_id: user_id,
      strategy_type: strategy_type,
    };

    const response = await axios.get(reccURL, { params });
    const reccJobID = response.data.recommendations;

    // Fetch job details from database
    const query = `
        MATCH (job:Job)-[:HAS_JOB_DESCRIPTION]->(jd:JobDescription)
        MATCH (job)-[:HAS_JOB_TASK]->(jt:JobTasks)
        WHERE job.jobid IN [${reccJobID}]
        WITH job, jd.\`Job Role Description\` AS jobRoleDescription, COLLECT(properties(jt).\`Key Tasks\`) AS keyTasksList
        RETURN job, jobRoleDescription, keyTasksList
      `;
    const result = await read(query, { reccJobID });
    const finalRes = formatData(result);
    
    // Send the response back to the client
    res.status(200).json(finalRes);
  } catch (error) {
    console.error('Error calling the recommendation API:', error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || 'Internal Server Error');
  }
}

const formatData = (result) => {
    const finalRes = result.records
    .map(record => record.toObject())
    .map(({ job, jobRoleDescription, keyTasksList }) => ({
        jobId: job.properties.jobid.low,
        sector: job.properties.Sector,
        jobRole: job.properties['Job Role'],
        track: job.properties.Track,
        jobRoleDescription,
        keyTasksList,
      }));

    return finalRes
}