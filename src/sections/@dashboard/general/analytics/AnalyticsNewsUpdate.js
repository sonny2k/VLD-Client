import PropTypes from 'prop-types';
import { useState } from 'react';
import { format } from 'date-fns';
// @mui
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
// utils
import { fToNow } from '../../../../utils/formatTime';
// _mock_
import { _analyticPost } from '../../../../_mock';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

export default function AnalyticsNewsUpdate({ articles }) {
  const [Load, setLoad] = useState(5);

  let check = false;

  const All = () => {
    setLoad(articles.length);
  };
  if (Load === articles.length) {
    check = true;
  }
  return (
    <Card>
      <CardHeader title="Bảng cập nhật tin tức" />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {articles.slice(0, Load).map((item) => (
            <NewsItem key={item._id} article={item} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      {check === false && (
        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button
            to="#"
            size="small"
            color="inherit"
            onClick={All}
            endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
          >
            Xem tất cả
          </Button>
        </Box>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  onEditRow: PropTypes.func,
  article: PropTypes.shape({
    briefdescription: PropTypes.string,
    banner: PropTypes.string,
    title: PropTypes.string,
    updatedat: PropTypes.string,
  }),
};

function NewsItem({ article, onEditRow}) {
  const { banner, title, briefdescription, updatedat } = article;
  
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Image alt={title} src={banner} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />
      <Box sx={{ minWidth: 240 }}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {briefdescription}
        </Typography>
      </Box>
      <Box sx={{ minWidth: 240 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          Lần cuối cập nhật: {format(new Date(updatedat), 'dd/MM/yyyy')}
        </Typography>
      </Box>

    </Stack>
  );
}
