import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { CodeSnippet } from '../common';
import { memo } from 'react';

function QuestionCard({ question, answer, codeSnippet }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.300',
        transition: 'all 0.2s ease-in-out',
        boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.02)',
        breakInside: 'avoid',
        display: 'inline-block',
        width: '100%',
        '&:hover': {
          borderColor: 'grey.400',
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <CardHeader
        sx={{ px: 2.5, py: 2, bgcolor: 'grey.100' }}
        title={
          <Typography variant="subtitle1" fontSize="1.1rem" lineHeight={1.5}>
            {question}
          </Typography>
        }
      />

      <CardContent
        sx={{
          px: 2.5,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '1rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
            color: 'grey.800',

            '& var': {
              color: 'warning.main',
              fontStyle: 'normal',
              fontWeight: 600,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              whiteSpace: 'nowrap',
            },
          }}
        >
          {answer}
        </Typography>

        {codeSnippet && <CodeSnippet codeSnippet={codeSnippet} />}
      </CardContent>
    </Card>
  );
}

export default memo(QuestionCard);
