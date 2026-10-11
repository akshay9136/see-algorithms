import { useMemo, memo } from 'react';
import { interviewQtns as questionsMap } from '@/data/interview-qtns';
import { Box, Typography } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import QuestionCard from './question-card';

function InterviewQtns({
  algorithmId,
  questions: customQuestions,
  title,
}) {
  const questionList = useMemo(
    () => customQuestions || questionsMap[algorithmId],
    [algorithmId, customQuestions],
  );

  if (!questionList) return null;

  return (
    <Box component="section" my={3}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <HelpOutline color="warning" />
        <Typography variant="h5" component="h2">
          {title || 'Common Interview Questions'}
        </Typography>
      </Box>
      <Box
        sx={{
          columnCount: { xs: 1, md: 2 },
          columnGap: 2.5,
          '& > *': { breakInside: 'avoid', mt: 2 },
        }}
      >
        {questionList.map((q, i) => (
          <QuestionCard {...q} key={`${algorithmId}_IQ_${i + 1}`} />
        ))}
      </Box>
    </Box>
  );
}

export default memo(InterviewQtns);
