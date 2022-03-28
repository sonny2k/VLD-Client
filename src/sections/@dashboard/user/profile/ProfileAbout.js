import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfileAbout.propTypes = {
  doctor: PropTypes.object,
};

export default function ProfileAbout({ doctor }) {
  const { description, educationplace, workcertificate, level, department, degree, workhistory  } = doctor;

  return (
    <Card>
      <CardHeader title="Thông tin chung" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{description}</Typography>

        <Stack direction="row">
          <IconStyle icon={'carbon:certificate'} />
          <Typography variant="body2">
            Chứng chỉ hành nghề:&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {workcertificate}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'fa6-solid:ranking-star'} />
          <Typography variant="body2">
            Trình độ:&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {degree}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'healthicons:outpatient-department'} />
          <Typography variant="body2">
            Phòng ban:&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {department}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'fa-solid:user-graduate'} />
          <Typography variant="body2">
            Tốt nghiệp&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {educationplace}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:twotone-timeline'} />
          <Typography variant="body2">
            Quá trình công tác |&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {workhistory}
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
