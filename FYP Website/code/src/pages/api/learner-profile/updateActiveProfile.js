import { write } from '../../../db/neo4j';
import verifyJWT from '../../../middlewares/verifyJWT';
import withMiddleware from '../../../utils/middleware/withMiddleware';

const handler = async (req, res) => {
    const { email, uuid } = req.body;

    const query = `
    MATCH (u:User {email: $email})
    SET u.state = $uuid
    RETURN u;
    `;

    try {
        const result = await write(query, {
            email: email,
            uuid: uuid
        });
        const state = result.records.map(record => record.toObject());
        res.status(200).json({ message: 'Success', state });

    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ message: 'Error' });
    }
};

export default withMiddleware(verifyJWT)(handler);
