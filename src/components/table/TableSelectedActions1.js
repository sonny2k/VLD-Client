import PropTypes from 'prop-types';
// @mui
import { Checkbox, Typography, Stack } from '@mui/material';

// ----------------------------------------------------------------------

TableSelectedActions1.propTypes = {
  dense: PropTypes.bool,
  actions: PropTypes.node,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
};

export default function TableSelectedActions1({ dense, actions, rowCount, numSelected, onSelectAllRows }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        px: 2,
        top: 0,
        right: 8,
        zIndex: 9,
        height: 58,
        borderRadius: 1,
        position: 'absolute',
        width: 'calc(100% - 16px)',
        bgcolor: 'primary.lighter',
        ...(dense && {
          pl: 1,
          height: 38,
        }),
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: 'primary.main',
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        đã chọn {numSelected} mục
      </Typography>

      {actions && actions}
    </Stack>
  );
}
