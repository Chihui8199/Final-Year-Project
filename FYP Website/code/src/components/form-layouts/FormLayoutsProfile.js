import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUserContext } from 'src/context/UserContext'
import { getEndpointPath } from 'src/utils/endpoints/endpointUtils'
import { getRoutePath } from 'src/utils/routes/routeUtils'
import {
  Card,
  Grid,
  Button,
  Chip,
  InputLabel,
  OutlinedInput,
  Select,
  Box,
  MenuItem,
  CardContent,
  Autocomplete,
  TextField
} from '@mui/material'

import { styled } from '@mui/material/styles'
import { createFilterOptions } from '@mui/material/Autocomplete'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300
    }
  }
}

const Form = styled('form')(({ theme }) => ({
  maxWidth: 1000,
  padding: theme.spacing(12),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`
}))

const FormLayoutsAlignment = () => {
  const router = useRouter()
  const [jobData, setJobData] = useState([])
  const [curJobRole, setCurRole] = useState('')
  const [targetJobRole, setTargetRole] = useState('')
  const [prevJob, setPrevJobIds] = useState([])
  const { user } = useUserContext();

  const handlePreviousJobs = (event, values) => {
    const ids = values.map(item => item.JobId)
    setPrevJobIds(ids)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(getEndpointPath("Get All Jobs"), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        });
  
        if (result.ok) {
          const data = await result.json()
          setJobData(data.data)
        } else {
          console.error('Failed to fetch data')
        }
      } catch (error) {
        console.error('An error occurred while fetching data:', error)
      }
    }
    fetchData()
  }, [])
  


  const handleCurJobRole = (event, value) => {
    const curJobID = value?.JobId
    setCurRole(curJobID)
  }

  const handleTargetJobRole = (event, value) => {
    const targetJobID = value?.JobId
    setTargetRole(targetJobID)
  }

  const handleOnClick = e => {
    // TODO: look into why prevJob turns in an string when there's only one element??
    const queryTechnicalSkills = [...prevJob, curJobRole]
    const queryTechnicalSkillsString = queryTechnicalSkills.join(',')

    const result = {
      prevJob,
      curJobRole,
      targetJobRole,
      queryTechnicalSkillsString
    }
    const technicalSkillsRoute = getRoutePath('Technical Skills')
    router.push(
      {
        pathname: technicalSkillsRoute,
        query: result
      },
      technicalSkillsRoute
      
    )
  }

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 500
  })

  return (
    <Card>
      <CardContent sx={{ minHeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={10}>
            <Grid item xs={12}>
              <InputLabel id='demo-multiple-chip-label'>Previous Job Role(s)</InputLabel>
              <Autocomplete
                multiple
                id='tags-standard'
                options={jobData}
                getOptionLabel={option => option.DisplayName}
                renderOption={(props, option) => (
                  <Box component='li' key={option.JobId} {...props}>
                    {option.DisplayName}
                  </Box>
                )}
                onChange={handlePreviousJobs}
                filterOptions={filterOptions}
                isOptionEqualToValue={(option, value) => option['Job Role'] === value['Job Role']}
                renderInput={params => <TextField {...params} variant='standard' placeholder='Enter your previous jobs ' />}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel id='demo-multiple-chip-label'>Current Job Role</InputLabel>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={jobData}
                getOptionLabel={option => option.DisplayName}
                filterOptions={filterOptions}
                isOptionEqualToValue={(option, value) => option['Job Role'] === value['Job Role']}
                renderOption={(props, option) => (
                  <Box component='li' key={option.JobId} {...props}>
                    {option.DisplayName}
                  </Box>
                )}
                sx={{ width: '100%' }}
                onChange={handleCurJobRole}
                renderInput={params => <TextField {...params}/>}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel id='demo-multiple-chip-label'>Desired Job Role</InputLabel>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={jobData}
                getOptionLabel={option => option.DisplayName}
                filterOptions={filterOptions}
                isOptionEqualToValue={(option, value) => option['Job Role'] === value['Job Role']}
                renderOption={(props, option) => (
                  <Box component='li' key={option.JobId} {...props}>
                    {option.DisplayName}
                  </Box>
                )}
                sx={{ width: '100%' }}
                onChange={handleTargetJobRole}
                renderInput={params => <TextField {...params}/>}
              />
            </Grid>
            <Grid item xs={12}>
              <Button size='large' type='submit' onClick={handleOnClick} variant='contained' sx={{ width: '100%' }}>
                Proceed to Skills & Competencies
              </Button>
            </Grid>
          </Grid>
        </Form>
      </CardContent>
    </Card>
  )
}

export default FormLayoutsAlignment;
