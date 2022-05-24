import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
// components
import { MotionContainer, TextAnimate, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage:
    'url(https://minimal-assets-api.vercel.app/assets/overlay.svg), url(https://nhakhoakim.com/wp-content/uploads/2021/10/BannerBS-6x-update-04.10.21-scaled.jpg)',
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    height: 560,
    padding: 0,
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    position: 'absolute',
    bottom: theme.spacing(10),
  },
}));

// ----------------------------------------------------------------------

export default function AboutHero() {
  return (
    <RootStyle>
      <Container component={MotionContainer} sx={{ position: 'relative', height: '100%' }}>
        {/* <ContentStyle>
          <TextAnimate text="VanLangDoctor" sx={{ color: 'Black' }} variants={varFade().inRight} />
          <br />
          <Box sx={{ display: 'inline-flex', color: 'Black' }}>
            <TextAnimate text="là" sx={{ mr: 2 }} />
            <TextAnimate text="ai?" />
          </Box>

          <m.div variants={varFade().inRight}>
            <Typography
              variant="h4"
              sx={{
                mt: 5,
                color: 'common.white',
                fontWeight: 'fontWeightMedium',
              }}
            >
              Let's work together and
              <br /> make awesome site easily
            </Typography>
          </m.div>
        </ContentStyle> */}
      </Container>
    </RootStyle>
  );
}
