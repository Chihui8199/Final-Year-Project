import React from 'react';
import { Card, CardContent, CircularProgress, Typography } from '@mui/material';

const LoadingCard = () => {
  return (
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
  );
};

export default LoadingCard;
