import { useState, useEffect } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Stepper from '../../../views/stepper/'
import { useRouter } from 'next/router'
import { Paper, Grid, Typography } from '@mui/material'
import { Button } from '@mui/material'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const TechnicalSkillsProfile = props => {
  const router = useRouter()
  console.log('QUERY', router.query)
  const [results, setResults] = useState(null)
  const [profFilteringList, setFilteringList] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: fetch get required proficiency based on prev and current job only
        const jobProf = await fetch('/api/getRequiredProficiency')
        if (jobProf.ok) {
          const profFilteringList = jobProf.json()
          setFilteringList(profFilteringList)
          console.log('jobProf', profFilteringList)
        } else {
          console.error('Failed to fetch data from /api/jobs')
        }
      } catch (error) {
        console.error('An error occurred while fetching data:', error)
      }
    }

    fetchData()
  }, [])



  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch('/api/technicalskills')
        if (result.ok) {
          const data = await result.json()
          setResults(data.data)
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
      <DatePickerWrapper>
        <body2>SET UP LEARNER PROFILE</body2>
        <h1 style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '2px' }}>Step 2. Skills and Competencies</h1>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={12}>
            <Typography variant='subtitle1' sx={{ marginBottom: '3%' }}>
              Review Your Mastery of Technical Skills You Have
            </Typography>
            {results && profFilteringList && results.map((item, index) => item && (
              <Paper key={index} elevation={5} style={{ padding: '20px', marginBottom: '20px' }}>
                <Stepper item={item} filters={profFilteringList}/>
              </Paper>
            ))}
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary">
              Next
            </Button>
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </div>
  );
}

export default TechnicalSkillsProfile
