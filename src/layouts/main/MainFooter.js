import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Link, Divider, Container, Typography, Stack } from '@mui/material';
// routes
import { PATH_PAGE } from '../../routes/paths';
// components
import Logo from '../../components/Logo';
import SocialsButton from '../../components/SocialsButton';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Văn Lang Doctor',
    children: [
      { name: 'Về chúng tôi', href: PATH_PAGE.about },
      { name: 'Liên hệ', href: PATH_PAGE.contact },
      { name: 'FAQs', href: PATH_PAGE.faqs },
    ],
  },
  {
    headline: 'Pháp lý',
    children: [
      { name: 'Điều khoản và thỏa thuận', href: '#' },
      { name: 'Chính sách bảo mật', href: '#' },
    ],
  },
  {
    headline: 'Liên hệ',
    children: [
      { name: 'vanlangdoctor.tech@gmail.com', href: 'mailto:vanlangdoctor.tech@gmail.com' },
      {
        name: '45 Nguyễn Khắc Nhu, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh 700000, Việt Nam',
        href: 'https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+V%C4%83n+Lang+-+C%C6%A1+s%E1%BB%9F+1/@10.7627221,106.691053,17z/data=!4m5!3m4!1s0x31752f16ad86371b:0x949d258c9508b1f2!8m2!3d10.7627168!4d106.693247?hl=vi-VN',
      },
    ],
  },
];

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function MainFooter() {
  return (
    <RootStyle>
      <Divider />
      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Logo sx={{ mx: { xs: 'auto', md: 'inherit' } }} />
          </Grid>
          <Grid item xs={8} md={3}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              Van Lang Doctor là đồ án Capstone của Team 16 thuộc khóa K24 khoa Kỹ Thuật Phần Mềm trường đại học Văn
              Lang.
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ mt: 5, mb: { xs: 5, md: 0 } }}
            >
              <SocialsButton sx={{ mx: 0.5 }} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={5} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
              {LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography component="p" variant="overline">
                    {list.headline}
                  </Typography>
                  {list.children.map((link) => (
                    <ul key={link.name}>
                      {link.headline === 'Liên hệ' ? (
                        <Link
                          to={link.href}
                          color="black"
                          variant="body2"
                          component={RouterLink}
                          sx={{ display: 'block' }}
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <a href={link.href}>{link.name} </a>
                      )}
                    </ul>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <Typography
          component="p"
          variant="body2"
          sx={{
            mt: 10,
            pb: 5,
            fontSize: 13,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          © 2022 Văn Lang Doctor
        </Typography>
      </Container>
    </RootStyle>
  );
}
