// ** MUI Imports
import Grid from '@mui/material/Grid';
import Layout from '../../../components/layout'

// ** Demo Components Imports
import FormLayoutsProfile from 'src/components/form-layouts/FormLayoutsProfile';

const LearnerProfile = ({ auth }) => {
  return (
    <Layout>
      <div>
        <h1>1. Job Details</h1>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <FormLayoutsProfile />
            </Grid>
          </Grid>
      </div>
    </Layout>
  );
};

export default LearnerProfile;
