import { read } from '../../../db/neo4j'

export default async function handler(req, res) {
  const query = `
    MATCH (n:Job) RETURN n;
    `
  const result = await read(query)
  const values = await result.records.map(record => record.toObject())

  // clean up the data values

  // Create a new array with reformatted data
  const reformattedData = values.map(item => ({
    JobId: item.n.properties.jobid.low,
    'Job Role': item.n.properties['Job Role'],
    Sector: item.n.properties.Sector,
    Track: item.n.properties.Track,
    ElementID: item.n.elementId, 
    DisplayName: `${item.n.properties['Job Role']} - ${item.n.properties.Sector} - ${item.n.properties.Track}`
  }))
  res.status(200).json({ data: reformattedData })
}
