import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Stack, InputAdornment } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import InputStyle from '../../components/InputStyle';
import { MotionContainer, TextAnimate, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  backgroundSize: 'cover',
  backgroundImage:
    'url(https://minimal-assets-api.vercel.app/assets/overlay.svg), url(https://www.ucsfhealth.org/-/media/project/ucsf/ucsf-health/education/hero/womens-health-checklist-questions-to-ask-your-provider-2x.jpg?h=1112&w=2880&hash=EF078B9E4D4A74FADB94C3E8071A8E1F)',
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    height: 560,
    padding: 0,
  },
}));

const ContentStyle = styled(Stack)(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    position: 'absolute',
    bottom: theme.spacing(10),
  },
}));

// ----------------------------------------------------------------------

export default function FaqsHero() {
  return (
    <RootStyle>
      <Container component={MotionContainer} sx={{ position: 'relative', height: '100%' }}>
        <ContentStyle spacing={5}>
          <div>
            <Box sx={{ color: 'primary.main' }} variants={varFade().inRight}>
              <TextAnimate text="Những" sx={{ mr: 2 }} />
              <TextAnimate text="câu" sx={{ mr: 2 }} />
              <TextAnimate text="hỏi" sx={{ mr: 2 }} />
            </Box>
            <br />
            <Box sx={{ display: 'inline-flex', color: 'black' }}>
              <TextAnimate text="thường" sx={{ mr: 2 }} />
              <TextAnimate text="gặp" />
            </Box>
          </div>

          <m.div variants={varFade().inUp}>
            <InputStyle
              stretchStart={280}
              placeholder="Tìm kiếm hỗ trợ"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'common.white',
                },
              }}
            />
          </m.div>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
