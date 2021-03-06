// @mui
import { Stack, Button, Typography } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_DOCS } from '../../../routes/paths';
// assets
import { DocIllustration } from '../../../assets';

// ----------------------------------------------------------------------

export default function NavbarAdmin() {
  const { account } = useAuth();

  return (
    <Stack spacing={3} sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center', display: 'block' }}>
      <DocIllustration sx={{ width: 1 }} />

      <div>
        <Typography gutterBottom variant="subtitle1">
          Xin chào, {account?.fname}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Cần trợ giúp?
          <br /> Vui lòng xem qua hướng dẫn sử dụng
        </Typography>
      </div>

      <Button
        href={'https://vanlangdoctor.notion.site/vanlangdoctor/Admin-9124f504ccea482d97137c9a298a611b'}
        target="_blank"
        rel="noopener"
        variant="contained"
      >
        Tài liệu
      </Button>
    </Stack>
  );
}
