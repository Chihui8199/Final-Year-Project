// ** Next Import
import Link from 'next/link';

// ** MUI Components
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';

// ** Router Import
import { useRouter } from 'next/router';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Demo Imports
import FooterIllustrations from 'src/components/pages/misc/FooterIllustrations';

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    height: 400,
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13),
  },
}));

const TreeIllustration = styled('img')(({ theme }) => ({
  left: 0,
  bottom: '5rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: 0,
  },
}));

const LandingPage = () => {
  const router = useRouter();

  const handleClick = async () => {
    router.push('/insights/login'); // Example: Redirect to a success page
  };

  return (
    <Card>
      <Grid container spacing={6}>
        <Grid
          container
          item
          xs={12}
          sm={7}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <CardContent
            sx={{
              padding: (theme) =>
                `${theme.spacing(3.25, 5.75, 6.25)} !important`,
            }}
          >
            <>
              <Typography
                variant="h2"
                sx={{
                  color: 'primary.main',
                  marginBottom: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                }}
              >
                Chart your path to a successful career with a simple quiz
              </Typography>
            </>
            <Button
              fullWidth
              size="large"
              onClick={handleClick}
              variant="contained"
              sx={{ marginBottom: 7 }}
            >
              Login to take quiz
            </Button>
          </CardContent>
        </Grid>
        <Grid
          item
          sm={5}
          xs={12}
          sx={{
            paddingTop: ['0 !important', '1.5rem !important'],
            paddingLeft: ['1.5rem !important', '0 !important'],
          }}
        >
          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'action.hover',
              padding: (theme) => `${theme.spacing(18, 5, 16)} !important`,
            }}
          >
            <Box>
              <Box
                sx={{
                  mb: 3.5,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  component="div"
                  variant="h6"
                  sx={{ lineHeight: 1, fontWeight: 600 }}
                >
                  Unsure of the steps to grow your career?
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ mb: 13.75, display: 'flex', flexDirection: 'column' }}
              >
                <span>
                  Skills Passport provides personalized upskilling and
                </span>
                <span>career recommendations by analysing your unique</span>
                <span>profile.</span>
              </Typography>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Img
                    height="487"
                    alt="error-illustration"
                    src="/images/pages/404.png"
                  />
                </Grid>
                <Grid item></Grid>
              </Grid>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
      <FooterIllustrations />
    </Card>
  );
};
LandingPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default LandingPage;
