import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { paramCase } from 'change-case';
import unorm from 'unorm';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
import axios from '../../../utils/axios';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import EmptyContent from '../../../components/EmptyContent';
import { IconButtonAnimate } from '../../../components/animate';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function NotificationsPopover({ notis }) {
  useEffect(() => {}, [notis]);

  const [open, setOpen] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const [position, setPosition] = useState(3);

  const { account } = useAuth();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    if (unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd('Người dùng').toLowerCase()) !== -1) {
      const role = 'user';
      seenAll(role);
    } else {
      const role = 'doctor';
      seenAll(role);
    }
  };

  const seenAll = async (role) => {
    try {
      await axios.post(`/api/${role}/consultation/areSeen`);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra với những thông báo này!', { variant: 'error' });
    }
  };

  const loadAllOldNoti = () => {
    setPosition(notis.length);
  };

  const thugon = () => {
    setPosition(3);
  };

  if (notis !== null && notis[0] !== null) {
    const totalUnRead = notis.filter((item) => item.seen === false).length;
    return (
      <>
        <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
          <Badge badgeContent={totalUnRead} color="error">
            <Iconify icon="eva:bell-fill" width={20} height={20} />
          </Badge>
        </IconButtonAnimate>

        {notis.length > 0 ? (
          <MenuPopover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleClose}
            sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">Thông báo</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Bạn đang có {totalUnRead} thông báo chưa đọc
                </Typography>
              </Box>

              {totalUnRead > 0 && (
                <Tooltip title="Đánh dấu là đã đọc">
                  <IconButtonAnimate color="primary">
                    <Iconify icon="eva:done-all-fill" width={20} height={20} onClick={handleMarkAllAsRead} />
                  </IconButtonAnimate>
                </Tooltip>
              )}
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Scrollbar sx={{ height: { xs: 250, sm: 300, md: 350, lg: 450 } }}>
              <List
                disablePadding
                subheader={
                  <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                    Thông báo mới
                  </ListSubheader>
                }
              >
                {[...notis]
                  .reverse()
                  .filter((notification) => notification.seen === false)
                  .map((notification) => (
                    <NotificationItem key={notification._id} notification={notification} />
                  ))}
              </List>

              <List
                disablePadding
                subheader={
                  <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                    Thông báo trước đó
                  </ListSubheader>
                }
              >
                {[...notis]
                  .reverse()
                  .filter((notification) => notification.seen === true)
                  .slice(0, position)
                  .map((notification) => (
                    <NotificationItem key={notification._id} notification={notification} />
                  ))}
              </List>
            </Scrollbar>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 1 }}>
              {position === 3 ? (
                <Button fullWidth disableRipple onClick={loadAllOldNoti}>
                  Xem tất cả
                </Button>
              ) : (
                <Button fullWidth disableRipple onClick={thugon}>
                  Thu gọn
                </Button>
              )}
            </Box>
          </MenuPopover>
        ) : (
          <MenuPopover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleClose}
            sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">Thông báo</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Bạn đang có {totalUnRead} thông báo chưa đọc
                </Typography>
              </Box>

              {totalUnRead > 0 && (
                <Tooltip title="Đánh dấu là đã đọc">
                  <IconButtonAnimate color="primary">
                    <Iconify icon="eva:done-all-fill" width={20} height={20} onClick={handleMarkAllAsRead} />
                  </IconButtonAnimate>
                </Tooltip>
              )}
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ height: { xs: 250, sm: 250, md: 250, lg: 250 } }}>
              <EmptyContent
                title="Bạn không có thông báo"
                img="https://www.facebook.com/images/comet/empty_states_icons/notifications/null_states_notifications_gray_wash.svg"
                sx={{ height: 300 }}
              />
            </Box>
          </MenuPopover>
        )}
      </>
    );
  }
  return null;
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string,
    seen: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    type: PropTypes.string,
  }),
};

function NotificationItem({ notification }) {
  const { title } = renderContent(notification);

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const seenDoc = async (_id) => {
    try {
      await axios.post('/api/doctor/consultation/isSeen', {
        _id,
      });
      navigate(`${PATH_DASHBOARD.user.root}/detail/${paramCase(notification.path)}`);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra với thông báo này!', { variant: 'error' });
    }
  };

  const seenUser = async (_id) => {
    try {
      await axios.post('/api/user/consultation/isSeen', {
        _id,
      });
      navigate(`${PATH_DASHBOARD.user.root}/detail/${paramCase(notification.path)}`);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra với thông báo này!', { variant: 'error' });
    }
  };

  return (
    <ListItemButton
      onClick={
        notification.type === 'canceldoc' ||
        notification.type === 'confirm' ||
        notification.type === 'createprescription'
          ? () => seenUser(notification._id)
          : () => seenDoc(notification._id)
      }
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.seen === false && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }} src={notification.creator.account.profilepic} />
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.notidate)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title =
    notification.type === 'confirm' ||
    notification.type === 'canceldoc' ||
    notification.type === 'createprescription' ? (
      <Typography variant="subtitle2">
        {`Bác sĩ ${notification.creator.account.fname} ${notification.title}`}
        <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp; {`${notification.message} bởi bác sĩ ${notification.creator.account.fname}`}
        </Typography>
      </Typography>
    ) : (
      <Typography variant="subtitle2">
        {`Người dùng ${notification.creator.account.fname} ${notification.title}`}
        <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp; {`${notification.message} bởi người dùng ${notification.creator.account.fname}`}
        </Typography>
      </Typography>
    );

  if (notification.type === 'createconsult') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'confirm') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'canceldoc') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_mail.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'canceluser') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_chat.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'createprescription') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_chat.svg"
        />
      ),
      title,
    };
  }
  // return {
  //   avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
  //   title,
  // };
}
