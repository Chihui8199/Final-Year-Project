import React from 'react'
import TimeLineAccordion from '../../../views/timelineaccordion'
import { useState, useEffect } from 'react'
import { Grid, Typography } from '@mui/material'
import DesiredJob from '../../../views/job-description'
import { useUserContext } from 'src/context/UserContext'

const UserAcquiredProficiency = () => {


  // TODO: fetch the user acquired proficiency based on the user learner profile id
  const [data, setData] = useState([])
  const { user } = useUserContext();
  console.log("user", user)
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

  // TODO: tehcnical job needes to be redered base on the following factors 
  // 1. User job created account  -> No learner profile
  // 2. Fetch the user learner profile id to display it
  // 3. Everytime the user create a new learner profile, the learner profile id will be updated
  // TODO: write conditional render when user is just created
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
