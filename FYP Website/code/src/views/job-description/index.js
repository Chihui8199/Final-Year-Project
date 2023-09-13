// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'

// Styled Box component
const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

// Import Routing
import { useRouter } from 'next/router'

const DesiredJob = props => {
  const router = useRouter()
  const { jobTitle } = props
  const doesProfileExists = jobTitle === undefined || jobTitle === '';
  console.log("FLAG", doesProfileExists)

  return (
    <Card>
      <Grid container spacing={6}>
        <Grid container item xs={12} sm={7} direction='column' justifyContent='center' alignItems='center'>
          <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
            {!doesProfileExists ? (
              <>
                <Typography component="div" variant='h6' sx={{ marginBottom: 1 }}>
                  I want to become a
                </Typography>
                <Typography
                  variant='h2'
                  sx={{ color: 'primary.main', marginBottom: 2.5, lineHeight: 1, fontWeight: 600 }}
                >
                  {jobTitle}
                </Typography>
              </>
            ) : (
              <Typography
                component="div"
                variant='h2'
                sx={{ color: 'primary.main', marginBottom: 2.5, lineHeight: 1, fontWeight: 600 }}
              >
                <Typography  component="div" variant='h6' sx={{ marginBottom: 1 }}>
                 Create Your Profile Now!
                </Typography>
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
              <Typography variant='body2' sx={{ color: 'primary.main' }}>
                Adopt a Growth Mindset and Keep Learning
              </Typography>
            </Box>
            <Typography variant='body2'>
              {' '}
              Understand the technical skills needed well and take courses to upskill
            </Typography>
          </CardContent>
        </Grid>
        <Grid
          item
          sm={5}
          xs={12}
          sx={{ paddingTop: ['0 !important', '1.5rem !important'], paddingLeft: ['1.5rem !important', '0 !important'] }}
        >
          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'action.hover',
              padding: theme => `${theme.spacing(18, 5, 16)} !important`
            }}
          >
            <Box>
              <Box sx={{ mb: 3.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Typography component="div" variant='h6' sx={{ lineHeight: 1, fontWeight: 600 }}>
                  Have more career goals?
                </Typography>
              </Box>
              <Typography variant='body2' sx={{ mb: 13.75, display: 'flex', flexDirection: 'column' }}>
                <span>Create and switch between different</span>
                <span>learner profiles to keep track</span>
                <span>of your career goals</span>
              </Typography>
              <Grid container direction='column' spacing={2}>
                <Grid item>
                  <Button
                    variant='contained'
                    onClick={() => {
                      router.push('/pages/learner-profile')
                    }}
                  >
                    Create Learner Profile
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    onClick={() => {
                      router.push('/pages/choose-profile')
                    }}
                  >
                    Switch Learner Profile
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default DesiredJob
