import { read } from '../../db/neo4j'

export default async function handler(req, res) {
  const queryParams = req.query
  const query = `
  MATCH (n:JobTSC)
  WHERE n.jobid IN  [${queryParams['ids']}] 
  WITH n
  ORDER BY n.\`TSC Key ID\`, n.\`Proficiency Level\`
  RETURN COLLECT({\`TSC Key ID\`: n.\`TSC Key ID\`, \`Proficiency Level\`: n.\`Proficiency Level\`}) AS result`
  const result = await read(query)
  const values = result.records[0]._fields[0]
  const data = values.map(item => {
    return {
      'TSC Key ID': item['TSC Key ID'].low,
      'Proficiency Level': item['Proficiency Level'].low
    }
  })

  const reducedArray = Object.values(
    data.reduce((accumulator, current) => {
      const keyId = current['TSC Key ID']
      if (!accumulator[keyId] || current['Proficiency Level'] > accumulator[keyId]['Proficiency Level']) {
        accumulator[keyId] = current
      }
      return accumulator
    }, {})
  )

  res.status(200).json(reducedArray)
}
