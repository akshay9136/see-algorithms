import { Children, useCallback, useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

export default function Carousel({
  children,
  activeStep: controlledStep,
  onChange,
  label = 'Slides',
  slideLabels = [],
  autoAdvanceMs,
}) {
  const slides = Children.toArray(children);
  const [selectedStep, setSelectedStep] = useState(0);
  const activeStep = controlledStep ?? selectedStep;
  const autoAdvance = autoAdvanceMs > 0 && slides.length > 1;
  const nextStep = (activeStep + 1) % slides.length;

  const selectStep = useCallback(
    (step) => {
      if (step === activeStep) return;
      if (controlledStep === undefined) setSelectedStep(step);
      onChange?.(step);
    },
    [activeStep, controlledStep, onChange],
  );

  useEffect(() => {
    if (!autoAdvance) return;
    const timer = setTimeout(() => selectStep(nextStep), autoAdvanceMs);
    return () => clearTimeout(timer);
  }, [autoAdvance, autoAdvanceMs, nextStep, selectStep]);

  return (
    <Box role="region" aria-roledescription="carousel" aria-label={label}>
      <Box sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            ...styles.track,
            transform: `translateX(-${activeStep * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <Box
              key={slide.key ?? index}
              role="group"
              aria-roledescription="slide"
              aria-label={
                slideLabels[index] ?? `${index + 1} of ${slides.length}`
              }
              aria-hidden={index !== activeStep}
              inert={index !== activeStep}
              sx={{
                flex: '0 0 100%',
                minWidth: 0,
                height: index === activeStep ? 'auto' : 0,
              }}
            >
              {slide}
            </Box>
          ))}
        </Box>
      </Box>

      {slides.length > 1 && (
        <Box sx={styles.navContainer}>
          <IconButton
            size="small"
            aria-label="Previous slide"
            onClick={() =>
              selectStep((activeStep + slides.length - 1) % slides.length)
            }
            sx={{ justifySelf: 'start' }}
          >
            <KeyboardArrowLeft />
          </IconButton>

          <Box role="group" aria-label="Choose a slide" display="flex">
            {slides.map((slide, index) => (
              <IconButton
                key={slide.key ?? index}
                size="small"
                aria-label={`Show ${slideLabels[index] || `slide ${index + 1}`}`}
                aria-current={index === activeStep || undefined}
                onClick={() => selectStep(index)}
                sx={{ padding: 1 }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor:
                      index === activeStep ? 'primary.main' : 'text.disabled',
                  }}
                />
              </IconButton>
            ))}
          </Box>

          <IconButton
            size="small"
            aria-label="Next slide"
            onClick={() => selectStep(nextStep)}
            sx={{ justifySelf: 'end' }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

const styles = {
  track: {
    display: 'flex',
    alignItems: 'flex-start',
    transition: 'transform 0.5s ease-in-out',
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  },
  navContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    padding: 1,
  },
};
