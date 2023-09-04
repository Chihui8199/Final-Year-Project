import { read } from '../../lib/neo4j'

export default async function handler(req, res) {
  const query = `
  MATCH (n:JobTSC)
  WHERE n.jobid IN [1, 2, 3]
  WITH n
  ORDER BY n.\`TSC Key ID\`, n.\`Proficiency Level\`
  RETURN COLLECT({\`TSC Key ID\`: n.\`TSC Key ID\`, \`Proficiency Level\`: n.\`Proficiency Level\`}) AS result`
  const result = await read(query)
  const values = result.records[0]._fields[0]
  const data = values.map(item => {
    console.log("ABC", item);
    return {
      "TSC Key ID": item["TSC Key ID"].low, 
      "Proficiency Level": item["Proficiency Level"].low,
    };
  });
  
  // clean up the data values

  
  res.status(200).json(data)
}
