import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

export default function Carousel({ children }) {
  const maxSteps = children.length;

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease-in-out',
          transform: `translateX(-${activeStep * 100}%)`,
        }}
      >
        {children}
      </Box>

      <Box sx={styles.navContainer}>
        <IconButton size="small" onClick={handleBack} sx={styles.navButton}>
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton size="small" onClick={handleNext} sx={styles.navButton}>
          <KeyboardArrowRight />
        </IconButton>
      </Box>

      <Box sx={styles.dotsContainer}>
        {children.map((_, index) => (
          <Box
            key={index}
            onClick={() => setActiveStep(index)}
            sx={{
              ...styles.dot,
              bgcolor:
                index === activeStep ? 'primary.main' : 'rgba(0, 0, 0, 0.5)',
              opacity: index === activeStep ? 1 : 0.6,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

const styles = {
  navContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    transform: 'translateY(-50%)',
    px: 1,
  },
  navButton: {
    bgcolor: 'rgba(0, 0, 0, 0.5)',
    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
    opacity: 0.8,
    color: 'white',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: 1.5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: 1,
  },
};
