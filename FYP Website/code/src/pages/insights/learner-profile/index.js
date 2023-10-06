// ** MUI Imports
import Grid from '@mui/material/Grid';
import Layout from '../../../components/layout';
import { Typography, Link, Divider } from '@mui/material';


// ** Demo Components Imports
import FormLayoutsProfile from 'src/components/form-layouts/FormLayoutsProfile';

const LearnerProfile = ({ auth }) => {
  return (
    <Layout>
      <div>
        <Typography variant="body2">SET UP LEARNER PROFILE </Typography>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" component="h1">
              Step 1. Job Details
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" component="p">
              STEP 1/2
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '3%' }}>
              Based on your input, we'll suggest jobs and key skills from the
              Skillsfuture Framework. Dive into&nbsp;
              <Link
                href="https://www.skillsfuture.gov.sg/initiatives/early-career/skills-framework"
                target="_blank"
                rel="noopener noreferrer"
              >
                SkillsFuture
              </Link>
              &nbsp;to identify skill gaps, get job recommendations, and
              discover more about this framework.
            </Typography>

            <FormLayoutsProfile />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default LearnerProfile;
