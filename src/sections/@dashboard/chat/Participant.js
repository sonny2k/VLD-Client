/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import unorm from 'unorm';
// @mui
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
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

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const { account } = useAuth();

  const bool = true;

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div>
      <h3>
        {/* {unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd('Người dùng').toLowerCase()) !== -1
          ? `Người khám ${participant.identity}`
          : `Bác sĩ ${participant.identity}`} */}
        {participant.identity}
      </h3>

      <video ref={videoRef} autoPlay={bool} />
      <audio ref={audioRef} autoPlay={bool} />
    </div>
  );
};

export default Participant;
