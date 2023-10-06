import React from 'react';
import TimeLineAccordion from '../../../components/timelineaccordion';
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import DesiredJob from '../../../components/job-description';
import { useUserContext } from 'src/context/UserContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShortLineWithDot from 'src/components/shortline-dot';
import steps from '../../../utils/data/insight-help/index'
import InfoCard from 'src/components/infocard';
import { getEndpointPath } from 'src/utils/endpoints/endpointUtils';

const UserAcquiredProficiency = () => {
  const [data, setData] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [accordionExpanded, setAccordionExpanded] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);

        return;
      }
      try {
        const results = await fetch(
          `${getEndpointPath('Acquired Skills')}?email=${user?.email}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user?.token}`,
            }
          }
        );
        if (results.ok) {
          const data = await results.json();
          setData(data);
          setJobTitle(data?.[0]?.jobTitle);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      } finally {
        // Set loading to false when the fetch operation is done
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              My Skills
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="flex-end">
              <InfoCard steps ={steps}/>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Track your progress and be informed of the courses you need to upskill
          and advance in your career.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
          Career Goal
        </Typography>
      </Grid>
      {loading ? (

        // Render a loading card while fetchData is happening
        <Card
          style={{
            minHeight: '20%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardContent style={{ textAlign: 'center', width: '100%' }}>
            <CircularProgress size="10%" style={{ marginBottom: '2%' }} />
            <Typography variant="body2">Loading...</Typography>
          </CardContent>
        </Card>
      ) : (

        // Render the DesiredJob and Accordion components when loading is false
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div>
              <DesiredJob jobTitle={jobTitle} />
            </div>
          </Grid>
          {data.length > 0 && (
            <Grid item xs={12}>
              <Accordion
                expanded={accordionExpanded}
                onChange={() => setAccordionExpanded(!accordionExpanded)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{ height: '125px' }}
                >
                  <Grid
                    container
                    spacing={3}
                    direction="row"
                    alignItems="center"
                    wrap="nowrap"
                  >
                    <Grid item xs={8} sx={{ marginRight: 4 }}>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{ color: 'primary.main' }}
                      >
                        View your Required Skills
                      </Typography>
                    </Grid>
                    <Grid item>
                      <ShortLineWithDot dotColor="success.main" />
                      <Typography
                        variant="caption"
                        component="div"
                        sx={{ marginLeft: 2 }} // Adjust as needed
                      >
                        Acquired Skills
                      </Typography>
                    </Grid>
                    <Grid item>
                      <ShortLineWithDot dotColor="error.main" />
                      <Typography
                        variant="caption"
                        component="div"
                        sx={{ marginLeft: 2 }} // Adjust as needed
                      >
                        Not Acquired
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>

                <AccordionDetails>
                  {data.map((item, index) => (
                    <TimeLineAccordion key={index} data={item} />
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
};

export default UserAcquiredProficiency;
