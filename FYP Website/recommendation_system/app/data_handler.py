import neo4j
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()

def connect_db(): 
    AURA_CONNECTION_URI = os.getenv('AURA_CONNECTION_URI')
    AURA_USERNAME = os.getenv('AURA_USERNAME')
    AURA_PASSWORD = os.getenv('AURA_PASSWORD')
    try:
        driver = GraphDatabase.driver(AURA_CONNECTION_URI, auth=(AURA_USERNAME, AURA_PASSWORD))
        return driver
    except Exception as e:
        print(f"Error connecting to db: {e}")
        return None

driver = connect_db()

def fetch_user_data(user_id):
    print("FETCHING USER DATA", user_id)
    if not driver:
        print("Driver not initialized")
        return None
    query = """
    MATCH (Us:User{email: $user_id})-[k:HAS_LEARNER_PROFILE]->(u:LearnerProfile)
    WHERE u.uuid = Us.state

    // Gather all job nodes associated with the learner
    OPTIONAL MATCH (u)-[:HAS_PREV_JOB|:HAS_CUR_JOB]->(j:Job)
    WITH u, COLLECT(DISTINCT j.jobid) as jobids

    // Traverse each job to get the skills
    UNWIND jobids AS jobid
    OPTIONAL MATCH (job:Job {jobid: jobid})-[:REQUIRE_TECHNICAL_SKILL]->(jt:JobTSC)-[:HAS_TSC_KEY]->(k:TSCKey)-[:HAS_PROFICIENCY]->(p:TSCProficiency)

    // Direct technical skills of the user
    OPTIONAL MATCH (u)-[:HAS_TECHNICAL_SKILLS]->(s:TSCProficiency)

    WITH u, jobids,
        REDUCE(output = [], skill IN COLLECT(DISTINCT {keyID: s.`TSC Key ID`, proficiency: s.`Proficiency Level`}) | output + skill) +
        REDUCE(output = [], skill IN COLLECT(DISTINCT {keyID: p.`TSC Key ID`, proficiency: p.`Proficiency Level`}) | output + skill) AS AllSkills
    RETURN AllSkills as data, jobids
    """
    
    with driver.session() as session:
        try:
            user_skills_data = list(session.run(query, user_id=user_id))
            return user_skills_data[0] # Format [data:{keyID: x, proficiency: y}, jobids: [a,b,c]]
        except Exception as e:
            print(f"Error fetching user data: {e}")
            return None