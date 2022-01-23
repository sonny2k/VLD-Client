import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
// sections
import { ResetPasswordForm } from '../../sections/auth/reset-password';
// assets
import { SentIcon } from '../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <Page title="Khôi phục mật khẩu" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
              <>
                <Typography variant="h3" paragraph>
                  Bạn quên mật khẩu?
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                  Vui lòng nhập số điện thoại ứng với tài khoản của bạn và mật khẩu mới.
                </Typography>

                <ResetPasswordForm />

                <Button fullWidth size="large" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 1 }}>
                  Trở về
                </Button>
              </>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
