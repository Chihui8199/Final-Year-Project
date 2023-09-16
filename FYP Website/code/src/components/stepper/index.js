import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField' // Import TextField
import results from '../../../result.json' // Import the JSON file
import { TextBox } from 'mdi-material-ui'

const steps = ['Foundational', 'Proficient', 'Skilled', 'Advanced', 'Expert', 'Master', 'No Proficiency']

import { useState, useEffect } from 'react'

const HorizontalNonLinearStepper = props => {
  const { data, filters, getFinalProf } = props
  const tscTitle = data['tscTitle']
  const tscKeyId = data['tscKeyID']

  // Sets the highest level of prof that the user has based on prev jobs
  const getProfLevelForTSCKey = () => {
    const stepLevel = filters.find(filter => filter['TSC Key ID'] === tscKeyId)
    
return stepLevel ? stepLevel['Proficiency Level'] : 1
  }

  const [activeStep, setActiveStep] = React.useState(getProfLevelForTSCKey() - 1)
  const [textBoxValue, setTextBoxValue] = React.useState([])

  useEffect(() => {
    // TODO: remember to convert prof 7 to a no prof in db
    getFinalProf({ tscKeyId: tscKeyId, profLevel: activeStep + 1 })

    const abilityDesc = data['proficiencyLevel'].find(item => item['proficiencyLevel'] === activeStep + 1)
      ?.filteredAbility || ['I have no proficiency']
    setTextBoxValue(abilityDesc)
  }, [activeStep])

  useEffect(() => {
    getFinalProf({ tscKeyId: tscKeyId, profLevel: activeStep + 1 })
  }, [])

  const handleStep = step => () => {
    setActiveStep(step)

    // Populate with the data from the database
  }

  const getDisabledSteps = () => {
    const excludeNumbers = data['proficiencyLevel'].map(item => item['proficiencyLevel'])
    const values = [1, 2, 3, 4, 5, 6]
    const filteredIndices = values.filter(value => !excludeNumbers.includes(value)).map(value => value - 1)
    
return filteredIndices
  }
  
return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ width: '100%' }}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton color='inherit' onClick={handleStep(index)} disabled={getDisabledSteps().includes(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                {tscTitle} - Level {activeStep + 1}
              </Typography>
              <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'primary.main' }}>
                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                  <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}></Typography>
                  <ul>
                    {textBoxValue.map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </Grid>
  )
}

export default HorizontalNonLinearStepper
