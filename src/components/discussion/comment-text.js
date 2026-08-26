import { memo } from 'react';
import { Box, Link, Typography } from '@mui/material';

// Regex patterns
const INLINE_CODE = /`([^`]+)`/g;
const URL_PATTERN = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;

/**
 * Splits a string by a regex into alternating [non-match, match, non-match, ...]
 * segments. Returns an array of { type: 'text'|'match', value, groups }.
 */
function splitByRegex(str, regex, type) {
  const segments = [];
  const re = new RegExp(regex.source, regex.flags.replace('g', '') + 'g');
  let lastIndex = 0;
  let match;
  while ((match = re.exec(str)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: str.slice(lastIndex, match.index) });
    }
    segments.push({ type, value: match[0], inner: match[1] ?? match[0] });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < str.length) {
    segments.push({ type: 'text', value: str.slice(lastIndex) });
  }
  return segments;
}

/**
 * Renders comment text with inline-code and URL highlighting.
 */
function renderInline(text) {
  const codeSegments = splitByRegex(text, INLINE_CODE, 'code');
  const nodes = [];

  codeSegments.forEach((seg, i) => {
    if (seg.type === 'code') {
      nodes.push(<code key={`code-${i}`}>{seg.inner}</code>);
    } else {
      const urlSegments = splitByRegex(seg.value, URL_PATTERN, 'url');
      urlSegments.forEach(({ type, value }, j) => {
        if (type === 'url') {
          nodes.push(
            <Link
              key={`url-${i + j}`}
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              {value.length > 60 ? value.slice(0, 57) + '...' : value}
            </Link>,
          );
        } else {
          nodes.push(<span key={`text-${i + j}`}>{value}</span>);
        }
      });
    }
  });

  return nodes;
}

/**
 * Parses comment text and renders inline code and URL segments with MUI components.
 */
function CommentText({ text }) {
  if (!text) return null;
  return (
    <Typography
      variant="body1"
      sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', my: 0.5 }}
    >
      {renderInline(text)}
    </Typography>
  );
}

export default memo(CommentText);
