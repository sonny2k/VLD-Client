import PropTypes from 'prop-types';
// @mui
import { LoadingButton } from '@mui/lab';
import { alpha } from '@mui/material/styles';
import { Box, Button, Container, Typography, DialogActions } from '@mui/material';
// components
import Image from '../../../components/Image';
import Markdown from '../../../components/Markdown';
import Scrollbar from '../../../components/Scrollbar';
import EmptyContent from '../../../components/EmptyContent';
import { DialogAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

BlogNewPostPreview.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default function BlogNewPostPreview({ values, isValid, isSubmitting, isOpen, onClose, onSubmit }) {
  const { title, content, briefdescription } = values;

  const banner = typeof values.banner === 'string' ? values.banner : values.banner?.preview;

  const hasContent = title || briefdescription || content || banner;

  const hasHero = title || banner;

  return (
    <DialogAnimate fullScreen open={isOpen} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Xem trước bài đăng
        </Typography>
        <Button onClick={onClose}>Hủy bỏ</Button>
        <LoadingButton type="submit" variant="contained" disabled={!isValid} loading={isSubmitting} onClick={onSubmit}>
          Đăng tin tức
        </LoadingButton>
      </DialogActions>

      {hasContent ? (
        <Scrollbar>
          {hasHero && <PreviewHero title={title || ''} banner={banner} />}
          <Container>
            <Box sx={{ mt: 5, mb: 10 }}>
              <Typography variant="h6" sx={{ mb: 5 }}>
                {briefdescription}
              </Typography>
              <Markdown children={content || ''} />
            </Box>
          </Container>
        </Scrollbar>
      ) : (
        <EmptyContent title="Nội dung trống" />
      )}
    </DialogAnimate>
  );
}

// ----------------------------------------------------------------------

PreviewHero.propTypes = {
  banner: PropTypes.string,
  title: PropTypes.string,
};

function PreviewHero({ title, banner }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Container
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9,
          color: 'common.white',
          position: 'absolute',
          pt: { xs: 3, lg: 10 },
        }}
      >
        <Typography variant="h2" component="h1">
          {title}
        </Typography>
      </Container>

      <Box
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 8,
          position: 'absolute',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
        }}
      />
      <Image alt="banner" src={banner} ratio="16/9" />
    </Box>
  );
}
