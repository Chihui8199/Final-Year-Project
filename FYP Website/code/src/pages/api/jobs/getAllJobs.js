import { read } from '../../../db/neo4j';
import verifyJWT from '../../../middlewares/verifyJWT';
import withMiddleware from '../../../utils/middleware/withMiddleware';

const handler = async (req, res) => {
    try {
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
        console.error('API error:', error);
        res.status(500).send('Internal server error');
    }
};

export default withMiddleware(verifyJWT)(handler);
