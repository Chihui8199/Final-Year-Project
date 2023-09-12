import React from 'react'
import TimeLineAccordion from '../../../views/timelineaccordion'
import { useState, useEffect } from 'react'
import { Grid, Typography } from '@mui/material'
import DesiredJob from '../../../views/job-description'
import { useUserContext } from 'src/context/UserContext'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const UserAcquiredProficiency = () => {
  const [data, setData] = useState([])
  const [jobTitle, setJobTitle] = useState('')
  const { user } = useUserContext()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await fetch(`/api/getAcquiredProficiency?email=${user.email}`, {
          method: 'GET'
        })
        if (results.ok) {
          const data = await results.json()
          setData(data)
          console.log("DATA", data?.[0])
          setJobTitle(data?.[0]?.jobTitle)
          console.log("TITLE", jobTitle)
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
        <Typography variant='h4' sx={{ marginBottom: 2 }}>
          My Skills
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 2 }}>
          Track your progress and be informed of the courses you need to upskill and advance in your career.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Career Goal
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        {data.length > 0 && (
          <>
            <Grid item xs={12}>
              <div>
                <DesiredJob jobTitle={jobTitle} />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Accordion   expanded={true} >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header' sx={{
    height: "80px"}} >
                  <Typography variant='h6' sx={{ marginBottom: 2, color: 'primary.main'}}>View your Required Skills</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {data.map((item, index) => (
                    <TimeLineAccordion key={index} data={item} />
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  )
}

export default UserAcquiredProficiency
