// ** MUI Imports
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import withAuth from '../../../hoc/auth'; // Import the withAuth HOC
import Error401 from  '../../401'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';

// ** Demo Components Imports
import FormLayoutsProfile from 'src/components/form-layouts/FormLayoutsProfile';

const LearnerProfile = ({ auth }) => {
  return (
    <div>
      {auth ? (
        <>
          <h1>1. Job Details</h1>
          <DatePickerWrapper>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <FormLayoutsProfile />
              </Grid>
            </Grid>
          </DatePickerWrapper>
        </>
      ) : (
        <Error401/>
      )}
    </div>
  );
};

export default withAuth(LearnerProfile);
