import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as React from 'react';

// @mui
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Box, Card, Avatar, Divider, Typography, Stack, IconButton, Tooltip, Link } from '@mui/material';
import Modal from '@mui/material/Modal';
import ModalCreateConsultation from '../account/CreateConsultation';
// utils
import cssStyles from '../../../../utils/cssStyles';
import { fShortenNumber } from '../../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Image from '../../../../components/Image';
import SocialsButton from '../../../../components/SocialsButton';
import SvgIconStyle from '../../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

// ----------------------------------------------------------------------

UserCard.propTypes = {
  doctor: PropTypes.object.isRequired,
};

export default function UserCard({ doctor }) {
  const { fname, lname, profilepic } = doctor.account;

  const { department, degree, workcertificate, _id, level } = doctor;

  const navigate = useNavigate();

  const linkTo = `${PATH_DASHBOARD.user.root}/profile/${paramCase(_id)}`;

  const name = `${level} ${lname} ${fname}`;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const detaildoc = () => {
    navigate(`${PATH_DASHBOARD.user.root}/profile/${paramCase(_id)}`);
  };

  const style = {
    display: 'block',
    rowGap: 3,
    columnGap: 2,
    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
    position: 'absolute',
    width: '800px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Avatar
            alt={name}
            src={profilepic}
            sx={{
              width: 64,
              height: 64,
              zIndex: 11,
              left: 0,
              right: 0,
              bottom: -32,
              mx: 'auto',
              position: 'absolute',
            }}
          />
        </Link>

        <OverlayStyle />
        <Image src={'https://i.imgur.com/ubQBnT3.jpg'} alt={name} ratio="16/9" />
      </Box>

      <Link to={linkTo} color="inherit" component={RouterLink}>
        <Typography variant="subtitle1" sx={{ mt: 6 }}>
          {name}
        </Typography>
      </Link>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {department}
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Tooltip title="Xem chi ti???t">
          <IconButton aria-label="Xem chi ti???t" onClick={detaildoc}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="H???n kh??m">
          <IconButton className="openModalBtn" onClick={handleOpen}>
            <EventAvailableIcon />
          </IconButton>
        </Tooltip>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <ModalCreateConsultation doctor={doctor} />
          </Box>
        </Modal>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ py: 3, display: 'grid', gridTemplateColumns: '1fr 1.5fr' }}>
        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Tr??nh ?????
          </Typography>
          <Typography variant="subtitle1">{degree}</Typography>
        </div>

        {/* <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            T???t nghi???p
          </Typography>
          <Typography variant="subtitle1">{educationplace}</Typography>
        </div> */}

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            Ch???ng ch???
          </Typography>
          <Typography variant="subtitle1">{workcertificate}</Typography>
        </div>
      </Box>
    </Card>
  );
}
