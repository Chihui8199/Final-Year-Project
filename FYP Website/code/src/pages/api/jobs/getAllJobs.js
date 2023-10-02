import { read } from '../../../db/neo4j';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Authorization header missing');
  const token = authHeader.split(' ')[1];

  try {
    const { JWT_SECRET } = process.env;
    const userVerified = jwt.verify(token, JWT_SECRET);

    const query = `
    MATCH (n:Job) RETURN n;
    `;

    const result = await read(query);
    const values = await result.records.map((record) => record.toObject());

    // Create a new array with reformatted data
    const reformattedData = values.map((item) => ({
      JobId: item.n.properties.jobid.low,
      'Job Role': item.n.properties['Job Role'],
      Sector: item.n.properties.Sector,
      Track: item.n.properties.Track,
      ElementID: item.n.elementId,
      DisplayName: `${item.n.properties['Job Role']} - ${item.n.properties.Sector} - ${item.n.properties.Track}`,
    }));
    res.status(200).json({ data: reformattedData });
  } catch (error) {
    console.error('Token verification failed', error);
    res.status(401).send('Invalid token');
  }
}
