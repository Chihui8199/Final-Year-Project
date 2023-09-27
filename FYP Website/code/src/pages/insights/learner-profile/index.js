// ** MUI Imports
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';

// ** Demo Components Imports
import FormLayoutsProfile from 'src/components/form-layouts/FormLayoutsProfile';

const LearnerProfile = () => {
  return (
    <div>
      <h1>1. Job Details</h1>
      <DatePickerWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <FormLayoutsProfile />
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </div>
  );
};

export default LearnerProfile;
