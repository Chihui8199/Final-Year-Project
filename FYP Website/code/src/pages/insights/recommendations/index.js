// ** External Libraries **
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Tab,
  Card,
  Typography,
  CardContent,
  Divider,
} from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';

// ** Internal Modules **
import { useUserContext } from 'src/context/UserContext';
import { getEndpointPath } from 'src/utils/endpoints/endpointUtils';
import LoadingCard from 'src/components/loading';
import RecommendationStepper from 'src/components/recc-stepper';
import InfoCard from 'src/components/infocard';
import Layout from '../../../components/layout';
import steps from '../../../utils/data/recc-help';

const Recommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [recc, setAlgo] = React.useState('content');

  const { user } = useUserContext();

  const handleChange = (event, newValue) => {
    setAlgo(newValue);
    setLoading(true);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      try {
        const response = await fetch(
          `${getEndpointPath('Get Recc')}?user_id=${
            user.email
          }&strategy_type=${recc}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user?.token}`,
            },
          },
        );

        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs', error);
        setLoading(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, recc]);

  return (
    <Layout>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Recommendations
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="flex-end">
              <InfoCard steps={steps} />
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Top Job Picks for You
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Based on Passport Insights, here are our job recommendations. Use them
          to search for relevant jobs!
        </Typography>
      </Grid>
      <Card>
        <TabContext value={recc}>
          <TabList
            centered
            onChange={handleChange}
            aria-label="card navigation example"
          >
            <Tab value="content" label="Content Algo" />
            <Tab value="embedding" label="Embedding Algo" />
            <Tab value="collaborative" label="Collaborative Algo" />
          </TabList>
          <CardContent sx={{ textAlign: 'left' }}>
            <TabPanel value="content" sx={{ p: 0 }}>
              {loading ? (
                <LoadingCard />
              ) : (
                <>
                  <RecommendationStepper jobs={jobs} />
                </>
              )}
            </TabPanel>
            <TabPanel value="embedding" sx={{ p: 0 }}>
              {loading ? (
                <LoadingCard />
              ) : (
                <>
                  <RecommendationStepper jobs={jobs} />
                </>
              )}
            </TabPanel>
            <TabPanel value="collaborative" sx={{ p: 0 }}>
              {loading ? (
                <LoadingCard />
              ) : (
                <>
                  <RecommendationStepper jobs={jobs} />
                </>
              )}
            </TabPanel>
          </CardContent>
        </TabContext>
      </Card>
    </Layout>
  );
};

export default Recommendations;
