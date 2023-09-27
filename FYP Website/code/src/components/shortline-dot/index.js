import * as React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

function ShortLineWithDot({ dotColor = 'primary.main' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '40px', height: '2px', backgroundColor: 'grey.500' }} />
      <Box
        sx={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          mx: 1, // margin on both left and right for spacing
        }}
      />
      <Box sx={{ width: '40px', height: '2px', backgroundColor: 'grey.500' }} />
    </Box>
  );
}

ShortLineWithDot.propTypes = {
  dotColor: PropTypes.string,
};

export default ShortLineWithDot;
