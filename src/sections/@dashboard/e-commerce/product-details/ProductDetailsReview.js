import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Divider, Collapse } from '@mui/material';
//
import ProductDetailsReviewForm from './ProductDetailsReviewForm';
import ProductDetailsReviewList from './ProductDetailsReviewList';
import ProductDetailsReviewOverview from './ProductDetailsReviewOverview';

// ----------------------------------------------------------------------

ProductDetailsReview.propTypes = {
  doctor: PropTypes.object,
};

export default function ProductDetailsReview({ doctor }) {
  const [reviewBox, setReviewBox] = useState(false);

  const handleOpenReviewBox = () => {
    setReviewBox((prev) => !prev);
  };

  const handleCloseReviewBox = () => {
    setReviewBox(false);
  };

  return (
    <>
      <ProductDetailsReviewOverview doctor={doctor} onOpen={handleOpenReviewBox} />

      <Divider />

      <Collapse in={reviewBox}>
        <ProductDetailsReviewForm doctor={doctor._id} onClose={handleCloseReviewBox} id="move_add_review" />
        <Divider />
      </Collapse>

      <ProductDetailsReviewList doctor={doctor} />
    </>
  );
}
