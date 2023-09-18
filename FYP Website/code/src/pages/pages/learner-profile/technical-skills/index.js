import { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Stepper from '../../../../components/stepper';
import { useRouter } from 'next/router';
import { Paper, Grid, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { useUserContext } from 'src/context/UserContext';
import LoadingCard from 'src/components/loading';

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';

const TechnicalSkillsProfile = (props) => {
  const router = useRouter();
  const { user } = useUserContext();

  const { prevJob, curJobRole, targetJobRole, queryTechnicalSkillsString } =
    router.query;
console.log('Passed to technical skills page', 'prevJob', prevJob, 'curJobRole', curJobRole, 'targetJobROle', targetJobRole, 'joined', queryTechnicalSkillsString)
  const [data, setData] = useState([]);
  const [finalDefinedProf, setFinalDefinedProf] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await fetch(
          `/api/technical-skills/getFormProficiency?pastJobIDs=${queryTechnicalSkillsString}&desiredJobIDs=${targetJobRole}`,
          {
            method: 'GET',
          },
        );
        if (response.ok) {
          const data = await response.json();
          setData(data);
          setLoading(false);
        } else {
          console.error('Failed to fetch data from /api/jobs');
        }
      };
      fetchData();
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  }, [queryTechnicalSkillsString, targetJobRole]);

  const getFinalProf = (indvTSCProfSelection) => {
    // Everything child changes this callback, it will be called and you can add the results/modify the state of the results using useState
    const { tscKeyId, profLevel: step } = indvTSCProfSelection;
    setFinalDefinedProf((prevState) => {
      // Create a copy of the previous state
      const newState = { ...prevState };

      // Check if the key exists in the newState
      if (newState.hasOwnProperty(tscKeyId)) {
        // If the key exists, update the value
        newState[tscKeyId] = step;
      } else {
        // If the key doesn't exist, create it with the new value
        newState[tscKeyId] = step;
      }

      // Return the updated state
      return newState;
    });
    console.log('Updating final prof', finalDefinedProf);
  };

  const handleSubmit = async () => {
    // Basically store all details about this learner profile
    setIsDisabled(true);

    const resultList = Object.keys(finalDefinedProf).map((key) => ({
      tscKeyID: parseInt(key),
      profLevel: finalDefinedProf[key],
    }));

    const final = {
      data: resultList,
      email: user.email,
      prevJobs: Array.isArray(prevJob) ? prevJob : [prevJob],
      curJobRole: curJobRole,
      targetJobRole: targetJobRole,
    };
    console.log(
      'This is the final object that will be sent to the backend',
      final,
    );

    const response = await fetch(`/api/learner-profile/createLearnerProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(final),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    router.push('/pages/acquired-skills');
  };

  return (
    <div>
      <DatePickerWrapper>
        <Typography variant="body2">SET UP LEARNER PROFILE </Typography>
        <h1 style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '2px' }}>
          Step 2. Skills and Competencies
        </h1>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '3%' }}>
              Review Your Mastery of Technical Skills You Have
            </Typography>
            {loading ? (
              <LoadingCard />
            ) : (
              data.map(
                (item, index) =>
                  item && (
                    <Paper
                      key={index}
                      elevation={5}
                      style={{ padding: '20px', marginBottom: '20px' }}
                    >
                      <Stepper item={item} getFinalProf={getFinalProf} />
                    </Paper>
                  ),
              )
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              disabled={isDisabled}
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </div>
  );
};

export default TechnicalSkillsProfile;