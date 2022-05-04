import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import Video from 'twilio-video';
import unorm from 'unorm';
// @mui
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MicIcon from '@mui/icons-material/Mic';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import {
  Box,
  Card,
  Avatar,
  Divider,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Link,
  Container,
  Button,
  Grid,
} from '@mui/material';
// utils
import cssStyles from '../../../utils/cssStyles';
import axios from '../../../utils/axios';
// sections
import Participant from './Participant';
// hooks
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Image from '../../../components/Image';
import SocialsButton from '../../../components/SocialsButton';
import SvgIconStyle from '../../../components/SvgIconStyle';

const OverlayStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

const Room = ({ roomName, token }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  const linkTo = `${PATH_DASHBOARD.user.root}/profile/${paramCase('112')}`;

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant));
    };

    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach((trackPublication) => {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        }
        return currentRoom;
      });
    };
  }, [roomName, token]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div>
      <Typography variant="h2" sx={{ color: 'text.disabled', mb: 3 }}>
        VĂN LANG DOCTOR
      </Typography>
      <Card md={12} mt={3} ml={3} mr={3} mb={3}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Card>{remoteParticipants}</Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>{room && <Participant key={room.localParticipant.sid} participant={room.localParticipant} />}</Card>
          </Grid>
        </Grid>

        <Stack alignItems="center" sx={{ mt: 1 }}>
          <Box
            sx={{
              display: 'grid',
              columnGap: 1,
              rowGap: 1,
              gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)' },
            }}
          >
            <Tooltip title="Tắt mic">
              <IconButton>
                <MicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Tắt camera">
              <IconButton>
                <VideoCameraFrontIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chia sẻ màn hình">
              <IconButton>
                <ScreenShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Card>
    </div>
  );
};

export default Room;
