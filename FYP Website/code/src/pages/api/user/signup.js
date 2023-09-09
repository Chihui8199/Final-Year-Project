import { write, read } from '../../../lib/neo4j' // Import necessary functions for read and write operations
import bcrypt from 'bcrypt'

export default async function register(req, res) {
  try {
    const { email, password } = req.body
    console.log('EMAIL', email, 'PASSWORD', password)

    // Check if the user with the same email already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    // If the user doesn't exist, proceed to register
    const hashedPassword = await bcrypt.hash(password, 10) // Hash the password

    // Create the user in your database
    const user = await createUser(email, hashedPassword)
    // Extract user properties
    const userData = user.records[0]._fields[0].properties
    return res.status(201).json({
      data: {
        email: userData.email // Extract the email property
        // TODO: You can include other properties if needed
      }
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'We are experiencing a server error, please try again later' })
  }
}
const getUserByEmail = async email => {
  const query = `
      MATCH (user:User { email: $email })
      RETURN user
    `

  const parameters = {
    email: email
  }

  const result = await read(query, parameters) // Use your read function for querying

  if (result && result.records.length > 0) {
    const userRecord = result.records[0].get('user')
    const userData = userRecord.properties // Extract user properties from the record
    return userData
  } else {
    return null
  }
}

const createUser = async (email, hashedPassword) => {
  const query = `
    CREATE (user:User {
        email: $email,
        password: $hashedPassword
    })
    RETURN user;
  `

  const parameters = {
    email: email,
    hashedPassword: hashedPassword
  }

  const user = await write(query, parameters) // Pass the parameters to your write function
  return user
}
