import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {
    Card,
    CardContent,
    Chip,
    Table,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    Button,
    CircularProgress
} from '@mui/material';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useUserContext } from 'src/context/UserContext';


const ProfileChoice = () => {
  const [data, setData] = useState([])
  const [activeProfileUUID, setActiveProfileUUID] = useState('')
  const [loading, setLoading] = useState(true) // Loading state
  const { user } = useUserContext()
  console.log('user from choose profile page', user?.email)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Check if user is not null
      fetchData()
    }
  }, [user]) // Make the effect depend on user

  const fetchData = async () => {
    try {
      const results = await fetch(`/api/getAllLearnerProfiles?email=${user.email}`, {
        method: 'GET'
      })
      if (results.ok) {
        const data = await results.json()
        setActiveProfileUUID(data.user.state)
        setData(data.learnerProfiles)
      } else {
        console.error('Failed to fetch data from /api/jobs')
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error)
    } finally {
      setLoading(false) // Set loading to false when the fetch operation is done
    }
  }

  const handleRowClick = async rowData => {
    const response = await fetch(`/api/updateActiveProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: user.email, uuid: rowData.uuid })
    })
    fetchData()
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
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
