import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useUserContext } from 'src/context/UserContext';
import LoadingCard from 'src/components/loading';
import { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function TextMobileStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const maxSteps = jobs.length;
  const [recc, setAlgo] = React.useState('content');

  const { user } = useUserContext();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const handleChange = (event) => {
    setAlgo(event.target.value);
  };

  function renderRow(props) {
    const { index, style } = props;
    const task = jobs[activeStep].keyTasksList[index];

    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemText
            primary={`${index + 1} ${task}`}
            primaryTypographyProps={{
              variant: 'caption', //
              textAlign: 'left',
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  }

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      try {
        const response = await fetch(
          `/api/recommendation/getJobsRecc?user_id=${user.email}&strategy_type=${recc}`,
          {
            method: 'GET',
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
    
    <div>
      {loading ? (
        <LoadingCard />
      ) : (
        <div>
          <div key={jobs.length}></div>
          <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Algorithm
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={recc}
                label="Algorithm"
                onChange={handleChange}
              >
                <MenuItem value={'content'}>Content</MenuItem>
                <MenuItem value={'embedding'}>Embedding</MenuItem>
                <MenuItem value={'collaborative'}>Collaborative</MenuItem>
              </Select>
              <FormHelperText>
                Choose the recommendation Algorithm
              </FormHelperText>
            </FormControl>
          </div>
          <Paper sx={{ elevation: 3 }}>
            <Box sx={{ p: 2, mx: 'auto' }}>
              <Paper
                square
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 50,
                  pl: 2,
                  bgcolor: 'background.default',
                }}
              >
                <Typography variant="h5">{jobs[activeStep]?.jobRole}</Typography>
              </Paper>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Job Description
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ marginTop: 3, textAlign: 'justify' }}
                >
                  {jobs[activeStep].jobRoleDescription}
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" color="primary" sx={{ px: 2 }}>
                  Job Tasks
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    bgcolor: 'background.paper',
                    mb: 10,
                  }}
                >
                  <FixedSizeList
                    height={250}
                    width={'100%'}
                    itemSize={46}
                    itemCount={jobs[activeStep].keyTasksList.length}
                    overscanCount={5}
                  >
                    {renderRow}
                  </FixedSizeList>
                </Box>
              </Box>

              <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                  >
                    Next
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                    Back
                  </Button>
                }
              />
            </Box>
          </Paper>
        </div>
      )}
    </div>
  );
}
