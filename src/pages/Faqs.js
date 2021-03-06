// @mui
import { styled } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { FaqsHero, FaqsCategory, FaqsList, FaqsForm } from '../sections/faqs';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------

export default function Faqs() {
  return (
    <Page title="Câu hỏi thường gặp">
      <RootStyle>
        <FaqsHero />

        <Container sx={{ mt: 15, mb: 10 }}>
          <FaqsCategory />

          <Typography variant="h3" sx={{ mb: 5 }}>
            Những câu hỏi thắc mắc thường gặp
          </Typography>

          <Grid container spacing={10}>
            <Grid item xs={12} md={6}>
              <FaqsList />
            </Grid>
            <Grid item xs={12} md={6}>
              <FaqsForm />
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}
