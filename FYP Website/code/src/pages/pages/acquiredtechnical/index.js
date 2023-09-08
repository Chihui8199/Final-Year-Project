import React from 'react'
import TimeLineAccordion from '../../../views/timelineaccordion'
import { useState, useEffect } from 'react'

const UserAcquiredProficiency = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            const results = await fetch(`/api/getAcquiredProficiency`,{
              method: 'GET'
            })
            if (results.ok) {
              const data = await results.json()
              setData(data)
            } else {
              console.error('Failed to fetch data from /api/jobs')
            }
          } catch (error) {
            console.error('An error occurred while fetching data:', error)
          }
        }
    
        fetchData()
      }, [])
  return (
    <div>
      {data.map((item, index) => (
        <TimeLineAccordion key={index} data={item} />
      ))}
    </div>
  )
}

export default UserAcquiredProficiency