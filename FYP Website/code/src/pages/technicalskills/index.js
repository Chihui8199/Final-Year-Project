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
const steps = ['No Proficiency', 'Basic', 'Intermediate', 'Advanced', 'Expert', 'Master']

const data = results

export default function HorizontalNonLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0)
  const [textBoxValue, setTextBoxValue] = React.useState([]) // State for the text box

  const handleStep = step => () => {
    setActiveStep(step)
    // Populate with the data from the database
    setTextBoxValue(data[0]['proficiencyLevels'][0]['filteredKnowledge']) // Reset the text box value
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ width: '100%' }}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton color='inherit' onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1, py: 1 }}>Level {activeStep + 1}</Typography>
              <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'primary.main' }}>
                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                  <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                    <ul>
                      {textBoxValue.map((value, index) => (
                        <li key={index}>{value}</li>
                      ))}
                    </ul>
                  </Typography>
                </CardContent>
              </Card>
            </React.Fragment>
          </div>
        </Box>
      </Grid>
    </Grid>
  )
}
