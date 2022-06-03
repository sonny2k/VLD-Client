import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, List, Button, Rating, Avatar, ListItem, Pagination, Typography } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

ProductDetailsReviewList.propTypes = {
  doctor: PropTypes.object,
};

export default function ProductDetailsReviewList({ doctor }) {
  const { ratings } = doctor;

  return (
    <Box sx={{ pt: 3, px: 2, pb: 5 }}>
      <List disablePadding>
        {ratings.reverse().map((rating) => rating.status === 1 && <ReviewItem key={rating._id} review={rating} />)}
      </List>
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination count={ratings.length} color="primary" />
      </Box> */}
    </Box>
  );
}

// ----------------------------------------------------------------------

ReviewItem.propTypes = {
  review: PropTypes.object,
};

function ReviewItem({ review }) {
  const { user, date, star, content } = review;

  const name = `${user.lname} ${user.fname}`;

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          mb: 5,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 0 },
            minWidth: { xs: 160, md: 240 },
            textAlign: { sm: 'center' },
            flexDirection: { sm: 'column' },
          }}
        >
          <Avatar
            src={user.profilepic}
            sx={{
              mr: { xs: 2, sm: 0 },
              mb: { sm: 2 },
              width: { md: 64 },
              height: { md: 64 },
            }}
          />
          <div>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {fDate(date)}
            </Typography>
          </div>
        </Box>

        <div>
          <Rating size="small" value={star} precision={0.1} readOnly />

          <Typography
            variant="caption"
            sx={{
              my: 1,
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main',
            }}
          >
            <Iconify icon={'ic:round-verified'} width={16} height={16} />
            &nbsp;Đã kiểm duyệt
          </Typography>

          <Typography variant="body2">{content}</Typography>
        </div>
      </ListItem>
    </>
  );
}
