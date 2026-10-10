import { Box, Chip, InputAdornment, TextField, IconButton } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import { catalogItems } from '@/data/algo-catalog';

export const CATEGORIES = [
  'All',
  'Sorting',
  'Graph',
  'Data Structures',
  'Advanced Trees',
  'Other',
];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  category,
  setCategory,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        mb: 3,
      }}
    >
      {/* Category Pills */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          const count =
            cat === 'All'
              ? catalogItems.length
              : catalogItems.filter((a) => a.category === cat).length;

          return (
            <Chip
              key={cat}
              label={`${cat} (${count})`}
              onClick={() => setCategory(cat)}
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                borderRadius: 2,
                borderColor: isSelected ? 'primary.main' : 'grey.300',
                bgcolor: isSelected ? 'primary.main' : 'white',
                color: isSelected ? 'white' : 'grey.700',
              }}
            />
          );
        })}
      </Box>

      {/* Local Search Input */}
      <Box sx={{ minWidth: { xs: '100%', md: 280 } }}>
        <TextField
          fullWidth
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter catalog..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onSearchChange('')}
                  edge="end"
                  aria-label="clear filter"
                >
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: {
              borderRadius: 2,
              bgcolor: 'white',
              '& fieldset': { borderColor: 'grey.300' },
            },
          }}
        />
      </Box>
    </Box>
  );
}
