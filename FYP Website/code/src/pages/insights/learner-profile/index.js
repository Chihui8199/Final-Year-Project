// ** MUI Imports
import Grid from '@mui/material/Grid';
import Layout from '../../../components/layout';
import { Typography, Link } from '@mui/material';

// ** Demo Components Imports
import FormLayoutsProfile from 'src/components/form-layouts/FormLayoutsProfile';

const LearnerProfile = ({ auth }) => {
  return (
    <Layout>
      <div>
        <Typography variant="body2">SET UP LEARNER PROFILE </Typography>
        <h1 style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '2px' }}>
          Step 1. Job Details
        </h1>
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
