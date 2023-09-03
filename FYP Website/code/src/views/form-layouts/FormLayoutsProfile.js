import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'

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
  const [jobData, setJobData] = useState(null)
  const [sectors, setSectors] = useState([])
  const [jobOptions, setJobOptions] = useState([])
  const [curSector, setCurSector] = useState('')
  const [curJobRole, setCurRole] = useState('')
  const [targetJobRole, setTargetRole] = useState('')
  const [prevJob, setPrevJobName] = useState([])

  const handlePreviousJobs = event => {
    setPrevJobName(event.target.value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch('/api/jobs')
        if (result.ok) {
          const data = await result.json()
          const sectors = [...new Set(data.data.map(item => item.Sector).filter(sector => sector !== null))]
          setJobData(data.data)
          setSectors(sectors)
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
    let jobOptions = null
    if (jobData) {
      jobOptions = Object.entries(jobData).map(([idx, job]) => (
        <MenuItem key={idx} value={job.JobId}>
          {job['Job Role']}
        </MenuItem>
      ))
    }
    setJobOptions(jobOptions)
  }, [jobData])

  const handleSelectCurSector = e => {
    setCurSector(e.target.value)
  }

  const handleCurJobRole = e => {
    setCurRole(e.target.value)
  }

  const handleTargetJobRole = e => {
    setTargetRole(e.target.value)
  }

  const handleOnClick = e => {
    const result = {
      prevJob,
      curSector,
      curJobRole,
      targetJobRole
    }
    console.log(result)
  }


  return (
    <Card>
      <CardContent sx={{ minHeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={10}>
            <Grid item xs={12}>
              <InputLabel id='demo-multiple-chip-label'>Previous Job Role(s)</InputLabel>
              <Select
                labelId='demo-multiple-chip-label'
                id='demo-multiple-chip'
                multiple
                value={prevJob}
                onChange={handlePreviousJobs}
                input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
                renderValue={selected => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map(id => {
                      const job = jobData.find(item => item.JobId === id)
                      const label = job ? job['Job Role'] : ''
                      return <Chip key={id} label={label} />
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {jobOptions}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <InputLabel id='demo-multiple-chip-label'>Current Sector</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={curSector}
                label='Age'
                onChange={handleSelectCurSector}
              >
                {sectors.map((q, index) => (
                  <MenuItem key={index} value={q}>
                    {q}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <InputLabel id='demo-multiple-chip-label'>Current Job Role</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={curJobRole}
                label='Age'
                onChange={handleCurJobRole}
              >
                {jobOptions}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <InputLabel id='demo-multiple-chip-label'>Desired Job Role</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={targetJobRole}
                label='Age'
                onChange={handleTargetJobRole}
              >
                {jobOptions}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button size='large' type='submit' onClick ={handleOnClick} variant='contained' sx={{ width: '100%' }}>
                Proceed to Skills & Competencies
              </Button>
            </Grid>
          </Grid>
        </Form>
      </CardContent>
    </Card>
  )
}

export default FormLayoutsAlignment
