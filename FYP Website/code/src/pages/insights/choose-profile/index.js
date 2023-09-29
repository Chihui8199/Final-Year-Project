import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
import CircularProgress from '@mui/material/CircularProgress' // Import CircularProgress for loading state
import { useUserContext } from 'src/context/UserContext'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'

const ProfileChoice = () => {
  const [data, setData] = useState([])
  const [activeProfileUUID, setActiveProfileUUID] = useState('')
  const [loading, setLoading] = useState(true) // Loading state
  const { user } = useUserContext()
  const router = useRouter()

  const fetchData = useCallback(async () => {
    if (!user || !user.email) return;  // Guard clause
  
    try {
      const results = await fetch(`/api/learner-profile/getAllLearnerProfiles?email=${user.email}`, {
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
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleRowClick = async rowData => {
    const response = await fetch(`/api/learner-profile/updateActiveProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: user.email, uuid: rowData.uuid })
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    fetchData();
  }
  

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
        {loading ? ( // Show loading card if loading is true
          <Card style={{ minHeight: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardContent style={{ textAlign: 'center', width: '100%' }}>
              <CircularProgress size='10%' style={{ marginBottom: '2%' }} />
              <Typography variant='body2'>Loading...</Typography>
            </CardContent>
          </Card>
        ) : (
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
                  <TableRow
                    hover
                    key={row.uuid}
                    onClick={() => handleRowClick(row)}
                    sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                  >
                    <TableCell>{row.desiredJobs[0]?.JobRole}</TableCell>
                    <TableCell>
                      <div>
                        <ul>
                          {row.previousJobs.map((job, index) => (
                            <li key={index}>{job.JobRole}</li>
                          ))}
                        </ul>
                      </div>
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
        )}
      </Card>
    </div>
  )
}

export default ProfileChoice
