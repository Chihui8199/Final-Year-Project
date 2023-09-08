import React from 'react'
import TimeLineAccordion from '../../../views/timelineaccordion'
import { useState, useEffect } from 'react'
import { Grid, Typography } from '@mui/material'
import DesiredJob from '../../../views/job-description'

const UserAcquiredProficiency = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await fetch(`/api/getAcquiredProficiency`, {
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
      <Grid item xs={12}>
        <Typography variant='h5'>My Skills</Typography>
        <Typography variant='body2'>Track your progress and be informed of the courses you need to upskill and advance in your career.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>Career Goal</Typography>
      </Grid>
      <DesiredJob />
      {data.map((item, index) => (
        <TimeLineAccordion key={index} data={item} />
      ))}
    </div>
  )
}

export default UserAcquiredProficiency
