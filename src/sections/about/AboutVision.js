// @mui
import { Box, Container, Typography, Grid } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionInView, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

export default function AboutVision() {
  return (
    <Container sx={{ mt: 10 }}>
      <Box
        sx={{
          mb: 10,
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Image
          src="https://1hnoof1mss9r2pb77wlon4zt-wpengine.netdna-ssl.com/wp-content/uploads/2018/04/iStock-638377134.jpg"
          alt="about-vision"
          effect="black-and-white"
        />

        <Box
          sx={{
            bottom: { xs: 24, md: 80 },
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            position: 'absolute',
            justifyContent: 'center',
          }}
        >
          {/* {['logo_amazon', 'logo_hbo', 'logo_ibm', 'logo_lya', 'logo_spotify', 'logo_netflix'].map((logo) => (
            <MotionInView key={logo} variants={varFade().in}>
              <Image
                alt={logo}
                src={`https://minimal-assets-api.vercel.app/assets/images/logos/${logo}.svg`}
                sx={{
                  m: { xs: 1.5, md: 3 },
                  height: { xs: 24, md: 32 },
                }}
              />
            </MotionInView>
          ))} */}
        </Box>
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8}>
          <MotionInView variants={varFade().inUp}>
            <Typography variant="h3" sx={{ textAlign: 'center' }}>
              Văn Lang Doctor luôn cố gắng để trở thành dịch vụ chăm sóc sức khỏe tốt nhất nhằm đáp ứng mọi nhu cầu khám
              chữa bệnh cho mọi người.
            </Typography>
          </MotionInView>
        </Grid>
      </Grid>
    </Container>
  );
}
