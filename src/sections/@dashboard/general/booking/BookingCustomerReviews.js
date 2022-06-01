import Slider from 'react-slick';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Stack,
  Avatar,
  Rating,
  Button,
  CardHeader,
  Typography,
  CardMedia,
  CardContent,
  CardActionArea,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import axios from '../../../../utils/axios';
// hooks
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
// _mock_
import { _bookingReview } from '../../../../_mock';
// components
import Iconify from '../../../../components/Iconify';
import { CarouselArrows } from '../../../../components/carousel';

// ----------------------------------------------------------------------

export default function BookingCustomerReviews() {
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const carouselRef = useRef(null);

  const isMountedRef = useIsMountedRef();

  const [ratings, setRatings] = useState([]);

  const getAllRatings = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/doctor/viewDocRatings');

      if (isMountedRef.current) {
        setRatings(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAllRatings();
  }, [getAllRatings, ratings]);

  const settings = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    adaptiveHeight: true,
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return ratings.length > 0 ? (
    <Card>
      <CardHeader
        title="Đánh giá từ người dùng"
        action={
          <CarouselArrows
            customIcon={'ic:round-keyboard-arrow-right'}
            onNext={handleNext}
            onPrevious={handlePrevious}
            sx={{ '& .arrow': { width: 28, height: 28, p: 0 } }}
          />
        }
        sx={{
          '& .MuiCardHeader-action': {
            alignSelf: 'center',
          },
        }}
      />

      <Slider ref={carouselRef} {...settings}>
        {ratings.map((doc) => (
          <ReviewItem
            noti={enqueueSnackbar}
            name={`${doc.account.lname} ${doc.account.fname}`}
            key={doc._id}
            doc={doc}
          />
        ))}
      </Slider>
    </Card>
  ) : (
    <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="https://media3.giphy.com/media/aCAzXzUR8GmDC/giphy.gif?cid=ecf05e47wr2wx6rajaw36huvd528h4vhhuy3lthxr6uf8yga&rid=giphy.gif&ct=g"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Đánh giá từ người dùng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hiện chưa có đánh giá nào
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// ----------------------------------------------------------------------

const approve = async (doc, rating, enqueueSnackbar) => {
  try {
    await axios.post('/api/admin/doctor/approveRating', {
      docId: doc._id,
      ratingId: rating._id,
    });
    enqueueSnackbar('Duyệt đánh giá thành công!');
  } catch (err) {
    console.error(err);
  }
};

const decline = async (doc, rating, enqueueSnackbar) => {
  try {
    await axios.post('/api/admin/doctor/declineRating', {
      docId: doc._id,
      ratingId: rating._id,
    });
    enqueueSnackbar('Từ chối đánh giá thành công!');
  } catch (err) {
    console.error(err);
  }
};

function ReviewItem({ doc, name }) {
  return doc.ratings.map(
    (rating) =>
      rating.status === 0 && (
        <Stack spacing={2} sx={{ minHeight: 402, position: 'relative', p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={rating.user.fname} src={rating.user.profilepic} />
            <div>
              <Typography variant="subtitle2">{`${rating.user.lname} ${rating.user.fname}`}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                Đăng lúc {fDate(rating.date)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                Đánh giá bác sĩ {name}
              </Typography>
            </div>
          </Stack>

          <Rating value={rating.star} size="small" readOnly precision={0.5} />
          <Typography variant="body2">{rating.content}</Typography>
          {/* 
      <Stack direction="row" flexWrap="wrap">
        {tags.map((tag) => (
          <Chip size="small" key={tag} label={tag} sx={{ mr: 1, mb: 1, color: 'text.secondary' }} />
        ))}
      </Stack> */}

          <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ flexGrow: 1 }}>
            <Button
              onClick={() => approve(doc, rating)}
              fullWidth
              variant="contained"
              endIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}
            >
              Duyệt
            </Button>
            <Button
              onClick={() => decline(doc, rating)}
              fullWidth
              variant="contained"
              color="error"
              endIcon={<Iconify icon={'eva:close-circle-fill'} />}
            >
              Từ chối
            </Button>
          </Stack>
        </Stack>
      )
  );
}
