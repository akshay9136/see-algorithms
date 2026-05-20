import { memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

function ComplexityTable({ data, hideTitle }) {
  return (
    <Box sx={{ mb: 3, flex: 1 }}>
      {!hideTitle && (
        <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>
          Time & Space Complexity
        </Typography>
      )}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2 }}
      >
        <Table sx={{ width: 'fit-content' }}>
          <TableHead sx={{ backgroundColor: 'action.hover' }}>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
                  Metric / Operation
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">Complexity</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">Description</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: '1rem' }}>
                  <strong>{row.type}</strong>
                </TableCell>
                <TableCell sx={{ fontSize: '1rem', whiteSpace: 'nowrap' }}>
                  <strong>{row.complexity}</strong>
                </TableCell>
                <TableCell sx={{ fontSize: '1rem', minWidth: 300 }}>
                  {row.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default memo(ComplexityTable);
