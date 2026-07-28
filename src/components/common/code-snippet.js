import { useState, memo } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ContentCopy, Check, CodeOutlined } from '@mui/icons-material';
import { blueGrey } from '@mui/material/colors';

function CodeSnippet({ codeSnippet }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(codeSnippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box
      mt={2}
      sx={{
        borderRadius: 2,
        bgcolor: blueGrey[900],
        color: 'grey.100',
        padding: 2,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        color={blueGrey[200]}
        mb={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <CodeOutlined fontSize="small" />
          <Typography
            variant="caption"
            fontWeight={600}
            letterSpacing={0.5}
            sx={{ textTransform: 'uppercase' }}
          >
            Code Snippet
          </Typography>
        </Box>

          <IconButton
            size="small"
            title="Copy Code"
            aria-label="Copy Code"
            onClick={handleCopyCode}
            sx={{
              color: blueGrey[200],
              '&:hover': { color: 'grey.100' },
            }}
          >
            {copied ? (
              <Check fontSize="small" />
            ) : (
              <ContentCopy fontSize="small" />
            )}
          </IconButton>
      </Box>

      <Typography
        component="pre"
        sx={{
          fontSize: '0.9rem',
          fontFamily: 'monospace',
          margin: 0,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.5,
        }}
      >
        {codeSnippet}
      </Typography>
    </Box>
  );
}

export default memo(CodeSnippet);
