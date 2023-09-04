import { useState, useEffect } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Stepper from '../../../views/stepper/'
import results from '../../../../result.json' // Import the JSON file\
import { useRouter } from 'next/router';
import { Paper, Grid, Typography } from '@mui/material';

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const TechnicalSkillsProfile = (props) => {
  const router = useRouter();
  console.log("QUERY", router.query);
  return (
   
<div>
  <h1>Step 2. Technical Skills</h1>
  <DatePickerWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          Modify and Select the Technical Skills You Have
        </Typography>
        {results.map((item, index) => (
          item && (
            <Paper key={index} elevation={5} style={{ padding: '20px', marginBottom: '20px' }}>
              <Stepper item={item} />
            </Paper>
          )
        ))}
      </Grid>
    </Grid>
  </DatePickerWrapper>
</div>
  )
}

export default TechnicalSkillsProfile
