// ** MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useUserContext } from 'src/context/UserContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

const ProfileChoice = () => {
  const [data, setData] = useState([])
  const [activeProfileUUID, setActiveProfileUUID] = useState('')

  const { user } = useUserContext()
  const router = useRouter();

  const fetchData = async () => {
    try {
      // TODO: fix broken login
      const email = 'testing@gmail.com';
      const results = await fetch(`/api/getAllLearnerProfiles?email=${email}`, {
        method: 'GET'
      });
      if (results.ok) {
        const data = await results.json();
        setActiveProfileUUID(data.user.state);
        setData(data.learnerProfiles);
      } else {
        console.error('Failed to fetch data from /api/jobs');
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 // TODO: handle userProfile shitz
  console.log('User Profile data', data.user)
  const handleRowClick = async (rowData) => {
    const response = await fetch(`/api/updateActiveProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: "testing@gmail.com", uuid: rowData.uuid})
    })
    fetchData();
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  };


  return (
    <div>
      <Button variant='text' startIcon={<ArrowBackIosIcon />} onClick={() => router.back()}>
        Back to My Skills
      </Button>
      <Typography variant='h6'> All Learner Profile</Typography>
      <Typography variant='body2' sx={{ marginBottom: 2 }}>
        Based on your primary learner profile, we will curate course and job recommendations for you.
      </Typography>
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>Career Goal</TableCell>
                <TableCell>Previous Job Roles</TableCell>
                <TableCell>Current Job Role</TableCell>
                <TableCell>Current Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(row => (
                <TableRow hover key={row.uuid} onClick={() => handleRowClick(row)} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell>{row.desiredJobs[0]?.JobRole}</TableCell>
                  <TableCell>
                    <ul>
                      {row.previousJobs.map((job, index) => (
                        <li key={index}>{job.JobRole}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{row.currentJobs[0]?.JobRole}</TableCell>
                  <TableCell>
                    {activeProfileUUID === row.uuid && (
                      <Chip
                        label='Active'
                        color='success'
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                          '& .MuiChip-label': { fontWeight: 500 }
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  )
}

export default ProfileChoice