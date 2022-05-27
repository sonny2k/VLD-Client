import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Rating, Button, Typography, LinearProgress, Stack, Link } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RatingStyle = styled(Rating)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const GridStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:nth-of-type(2)': {
    [theme.breakpoints.up('md')]: {
      borderLeft: `solid 1px ${theme.palette.divider}`,
      borderRight: `solid 1px ${theme.palette.divider}`,
    },
  },
}));

// ----------------------------------------------------------------------

ProductDetailsReviewOverview.propTypes = {
  product: PropTypes.object,
  onOpen: PropTypes.func,
};

export default function ProductDetailsReviewOverview({ doctor, onOpen }) {
  const { ratings } = doctor;

  const oneStar = ratings.filter((rating) => rating.star === 1 && rating.status === 1).length;
  const twoStars = ratings.filter((rating) => rating.star === 2 && rating.status === 1).length;
  const threeStars = ratings.filter((rating) => rating.star === 3 && rating.status === 1).length;
  const fourStars = ratings.filter((rating) => rating.star === 4 && rating.status === 1).length;
  const fiveStars = ratings.filter((rating) => rating.star === 5 && rating.status === 1).length;

  const totalRating = oneStar + twoStars + threeStars + fourStars + fiveStars;

  const oneValue = oneStar * 1;
  const twoValue = twoStars * 2;
  const threeValue = threeStars * 3;
  const fourValue = fourStars * 4;
  const fiveValue = fiveStars * 5;

  const totalValue = oneValue + twoValue + threeValue + fourValue + fiveValue;
  const total = totalValue / totalRating;
  return (
    <Grid container>
      <GridStyle item xs={12} md={4}>
        <Typography variant="subtitle1" gutterBottom>
          Đánh giá trung bình
        </Typography>
        <Typography variant="h2" gutterBottom sx={{ color: 'error.main' }}>
          {fShortenNumber(total)}/5
        </Typography>
        <RatingStyle readOnly value={total} precision={0.1} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ({fShortenNumber(totalRating)}
          &nbsp;đánh giá)
        </Typography>
      </GridStyle>

      <GridStyle item xs={12} md={4}>
        <Stack spacing={1.5} sx={{ width: 1 }}>
          <ProgressItem1 total={oneStar} totalRating={totalRating} />
          <ProgressItem2 total={twoStars} totalRating={totalRating} />
          <ProgressItem3 total={threeStars} totalRating={totalRating} />
          <ProgressItem4 total={fourStars} totalRating={totalRating} />
          <ProgressItem5 total={fiveStars} totalRating={totalRating} />
        </Stack>
      </GridStyle>

      <GridStyle item xs={12} md={4}>
        <Link href="#move_add_review" underline="none">
          <Button size="large" onClick={onOpen} variant="outlined" startIcon={<Iconify icon={'eva:edit-2-fill'} />}>
            Viết nhận xét của bạn
          </Button>
        </Link>
      </GridStyle>
    </Grid>
  );
}

// ----------------------------------------------------------------------

function ProgressItem1({ total, totalRating }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">1 sao</Typography>
      <LinearProgress
        variant="determinate"
        value={(total / totalRating) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: 'divider',
        }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 64, textAlign: 'right' }}>
        {fShortenNumber(total)}
      </Typography>
    </Stack>
  );
}

function ProgressItem2({ total, totalRating }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">2 sao</Typography>
      <LinearProgress
        variant="determinate"
        value={(total / totalRating) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: 'divider',
        }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 64, textAlign: 'right' }}>
        {fShortenNumber(total)}
      </Typography>
    </Stack>
  );
}

function ProgressItem3({ total, totalRating }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">3 sao</Typography>
      <LinearProgress
        variant="determinate"
        value={(total / totalRating) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: 'divider',
        }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 64, textAlign: 'right' }}>
        {fShortenNumber(total)}
      </Typography>
    </Stack>
  );
}

function ProgressItem4({ total, totalRating }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">4 sao</Typography>
      <LinearProgress
        variant="determinate"
        value={(total / totalRating) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: 'divider',
        }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 64, textAlign: 'right' }}>
        {fShortenNumber(total)}
      </Typography>
    </Stack>
  );
}

function ProgressItem5({ total, totalRating }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">5 sao</Typography>
      <LinearProgress
        variant="determinate"
        value={(total / totalRating) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: 'divider',
        }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 64, textAlign: 'right' }}>
        {fShortenNumber(total)}
      </Typography>
    </Stack>
  );
}
