import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';

// @mui
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
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
} from '@mui/material';
// utils
import cssStyles from '../../utils/cssStyles';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
// sections
import Room from '../../sections/@dashboard/chat/Room';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Image from '../../components/Image';
import SocialsButton from '../../components/SocialsButton';
import SvgIconStyle from '../../components/SvgIconStyle';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function Video() {
  const { themeStretch } = useSettings();

  const location = useLocation();

  const navigate = useNavigate();

  const date = location.state.date1;
  const hour = location.state.hour1;
  const username2 = location.state.username1;
  const roomName2 = location.state.roomname1;
  const id = location.state.id1;

  const [token, setToken] = useState(null);

  useEffect(() => {
    async function getToken() {
      try {
        const data = await axios.post('/api/videochat/room/join-room', {
          username: username2,
          roomName: roomName2,
        });
        setToken(data.data.token);
      } catch (error) {
        console.log(error);
      }
    }
    getToken();
  }, [username2, roomName2]);

  const handleLeave = () => {
    setToken(null);
    navigate(PATH_DASHBOARD.user.edit(id));
  };

  return (
    <Page title="Tư vấn trực tuyến">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={`Buổi tư vấn ngày ${format(new Date(date), 'dd/MM/yyyy')} lúc ${hour}`}
          links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Trò chuyện với bác sĩ' }]}
          // moreLink="https://fullcalendar.io/docs/react"
          action={
            <Button
              onClick={handleLeave}
              variant="contained"
              startIcon={<Iconify icon={'akar-icons:sign-out'} width={20} height={20} />}
            >
              Rời phòng tư vấn
            </Button>
          }
        />
        {token === null && <h1>Chưa có token và phòng tư vấn</h1>}
        {token !== null && <Room roomName={roomName2} token={token} />}
      </Container>
    </Page>
  );
}
