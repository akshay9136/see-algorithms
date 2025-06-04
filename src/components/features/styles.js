export const styles = {
  card: (feat) => ({
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 3,
    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    border: '1px solid',
    borderColor: 'grey.200',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.16)',
      borderColor: feat.color,
      '& .feature-icon': {
        transform: 'scale(1.1) rotate(5deg)',
      },
      '& .feature-bg': {
        opacity: 0.1,
      },
    },
  }),

  cardBackground: (feat) => ({
    position: 'absolute',
    top: -50,
    right: -50,
    width: 120,
    height: 120,
    background: feat.bgGradient,
    borderRadius: '50%',
    opacity: 0.05,
    transition: 'opacity 0.3s ease',
  }),

  iconBox: (feat) => ({
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 2,
    background: feat.bgGradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  }),

  accentLine: (feat) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    background: feat.bgGradient,
    transform: 'scaleX(0)',
    transformOrigin: 'center',
    transition: 'transform 0.3s ease',
    '.MuiCard-root:hover &': {
      transform: 'scaleX(1)',
    },
  }),
};
