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

  const total = sumBy(ratings, (star) => star.starCount);

  const oneStar = ratings.filter((rating) => rating.star === 1).length;
  const twoStars = ratings.filter((rating) => rating.star === 2).length;
  const threeStars = ratings.filter((rating) => rating.star === 3).length;
  const fourStars = ratings.filter((rating) => rating.star === 4).length;
  const fiveStars = ratings.filter((rating) => rating.star === 5).length;

  const totalRating = oneStar + twoStars + threeStars + fourStars + fiveStars;
  return (
    <Grid container>
      <GridStyle item xs={12} md={4}>
        <Typography variant="subtitle1" gutterBottom>
          Đánh giá trung bình
        </Typography>
        <Typography variant="h2" gutterBottom sx={{ color: 'error.main' }}>
          {totalRating}/5
        </Typography>
        <RatingStyle readOnly value={totalRating} precision={0.1} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ({fShortenNumber(ratings.length)}
          &nbsp;reviews)
        </Typography>
      </GridStyle>

      <GridStyle item xs={12} md={4}>
        <Stack spacing={1.5} sx={{ width: 1 }}>
          {ratings
            .slice(0)
            .reverse()
            .map((rating) => (
              <ProgressItem key={rating.name} star={rating} total={total} />
            ))}
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

ProgressItem.propTypes = {
  star: PropTypes.object,
  total: PropTypes.number,
};

function ProgressItem({ star, total }) {
  const { name, starCount, reviewCount } = star;
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">{name}</Typography>
      <LinearProgress
        variant="determinate"
        value={(starCount / total) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: 'divider',
        }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 64, textAlign: 'right' }}>
        {fShortenNumber(reviewCount)}
      </Typography>
    </Stack>
  );
}
