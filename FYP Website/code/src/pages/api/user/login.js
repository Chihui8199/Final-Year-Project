import { read } from '../../../db/neo4j'; // Import necessary functions for read and write operations
import bcrypt from 'bcrypt';

export default async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await getUserDetails(email);

    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    } else {
      return res.status(200).json({ data: user });
    }
  } catch (e) {
    console.error(e);

    return res
      .status(500)
      .json({
        message: 'We are experiencing a server error, please try again later',
      });
  }
}

const getUserDetails = async (email) => {
  const query = `MATCH (user:User { email: $email }) RETURN user`;

  const parameters = {
    email: email,
  };

  const result = await read(query, parameters);
  if (result && result.records.length > 0) {
    const userRecord = result.records[0].get('user');
    const userData = userRecord.properties;

    return userData;
  } else {
    return null;
  }
};

const comparePassword = async (userProvidedPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(userProvidedPassword, hashedPassword);

    return isMatch;
  } catch (error) {
    throw error; // Handle any errors that occur during comparison
  }
};
