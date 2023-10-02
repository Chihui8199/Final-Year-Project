import React from 'react';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { useTheme } from '@emotion/react';

const RecommendationStepper = ({ jobs }) => {
  const maxSteps = jobs?.length;
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
      <Paper sx={{ elevation: 3 }}>
        <Box sx={{ p: 2, mx: 'auto'}}>
        <Box sx={{ p: 2, mx: 'auto', height: '400px', overflow: 'auto' }}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6">{jobs[activeStep]?.jobRole}</Typography>
              <Chip
                label={`${jobs[activeStep]?.similarity ?? ''}%`}
                color="success"
                sx={{
                  height: 24,
                  fontSize: '0.80rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { fontWeight: 500 },
                  marginLeft: 1, // Adjust as needed for spacing
                }}
              />
            </Box>
            <Typography variant="subtitle1" color="primary">
              Job Description
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginTop: 3, textAlign: 'justify' }}
            >
              {jobs[activeStep]?.jobRoleDescription}
            </Typography>
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
  );
};

export default RecommendationStepper;
