import PropTypes from 'prop-types';
import { useRef, useState, useEffect} from 'react';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import Slider from 'react-slick';
import * as React from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Box, Stack, Card, Button, Container, Typography, IconButton, Tooltip, Link } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Modal from '@mui/material/Modal';
import ModalCreateConsultation from '../@dashboard/user/account/CreateConsultation';
// _mock_
import { _carouselsMembers } from '../../_mock';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import { CarouselArrows } from '../../components/carousel';
import SocialsButton from '../../components/SocialsButton';
import { MotionInView, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

export default function AboutTeam() {
  const carouselRef = useRef(null);
  const theme = useTheme();

  const [doctors, setDoctors] = useState([])
  useEffect(() => {
     async function fetchDoctors() {
        const URL = '/api/home/doctor'
        try {
           const res = await axios.get(URL)
           console.log(res.data)
           setDoctors(res.data)
        } catch (error) {
           console.log(error)
        }
     }
     fetchDoctors()
  }, [])

  const settings = {
    arrows: false,
    slidesToShow: 4,
    centerMode: true,
    centerPadding: '0px',
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: 1279,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 959,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handlePrevious = () => {
    carouselRef.current.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current.slickNext();
  };

  return (
    <Container sx={{ pb: 10, textAlign: 'center' }}>
      <MotionInView variants={varFade().inDown}>
        <Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.secondary' }}>
          V??n Lang Doctor
        </Typography>
      </MotionInView>

      <MotionInView variants={varFade().inUp}>
        <Typography variant="h2" sx={{ mb: 3 }}>
          ?????i ng?? b??c s?? gi??u kinh nghi???m
        </Typography>
      </MotionInView>

      <MotionInView variants={varFade().inUp}>
        <Typography
          sx={{
            mx: 'auto',
            maxWidth: 630,
            color: (theme) => (theme.palette.mode === 'light' ? 'text.secondary' : 'common.white'),
          }}
        >
          V???i th??m ni??n l??u n??m trong ngh??? c??ng v???i s??? t???n t??m, ch??ng t??i cam k???t gi??p b???n c?? ???????c s??? t?? v???n v??? s???c kh???e m???t c??ch chu???n x??c nh???t
        </Typography>
      </MotionInView>

      <Box sx={{ position: 'relative' }}>
        <CarouselArrows filled onNext={handleNext} onPrevious={handlePrevious}>
          <Slider ref={carouselRef} {...settings}>
            {doctors.map((doctor) => (
              <MotionInView key={doctor._id} variants={varFade().in} sx={{ px: 1.5, py: 10 }}>
                <MemberCard doctor={doctor} />
              </MotionInView>
            ))}
          </Slider>
        </CarouselArrows>
      </Box>
      <Button
        variant="outlined"
        color="inherit"
        size="large"
        endIcon={<Iconify icon={'ic:round-arrow-right-alt'} width={24} height={24} />}
        sx={{ mx: 'auto' }}
        href={PATH_DASHBOARD.user.cards}
      >
        Xem t???t c???
      </Button>
    </Container>
  );
}

// ----------------------------------------------------------------------

MemberCard.propTypes = {
  doctor: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
  }),
};

function MemberCard({ doctor }) {
  const { fname, lname, profilepic } = doctor.account;

  const { department, _id } = doctor;

  const linkTo = `${PATH_DASHBOARD.user.root}/profile/${paramCase(_id)}`;

  const name = `${lname} ${fname}`;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  return (
    <Card key={name} sx={{ p: 1 }}>
      <Link to={linkTo} color="inherit" component={RouterLink}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
          {name}
        </Typography>
      </Link>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        {department}
      </Typography>
      <Link to={linkTo} color="inherit" component={RouterLink}>
        <Image src={profilepic} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      </Link>
      <Stack alignItems="center" sx={{ mt: 2, mb: 1 }}>
        <Box sx={{position: 'relative'}}>
          <Tooltip title="Xem chi ti???t">
            <IconButton aria-label="Xem chi ti???t" href={`${PATH_DASHBOARD.user.root}/profile/${paramCase(_id)}`}>
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
      </Stack>
    </Card>
  );
}
