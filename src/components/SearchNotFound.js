import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return searchQuery ? (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Không tìm thấy
      </Typography>
      <Typography variant="body2" align="center">
        Không có kết quả nào cho từ khóa &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Vui lòng thử nhập lại ký tự hoặc điền đầy đủ ký tự
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2"> Vui lòng nhập từ khóa</Typography>
  );
}
