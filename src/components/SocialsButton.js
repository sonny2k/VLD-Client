import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Link, Stack, Button, Tooltip, IconButton } from '@mui/material';
//
import Iconify from './Iconify';

// ----------------------------------------------------------------------

sButton.propTypes = {
  initialColor: PropTypes.bool,
  links: PropTypes.objectOf(PropTypes.string),
  simple: PropTypes.bool,
  sx: PropTypes.object,
};

export default function sButton({ initialColor = false, simple = true, links = {}, sx, ...other }) {
  const S = [
    {
      name: 'Facebook',
      icon: 'eva:facebook-fill',
      Color: '#1877F2',
      path: 'https://www.facebook.com/vanlangdoctor.tech/',
    },
    {
      name: 'Instagram',
      icon: 'ant-design:instagram-filled',
      Color: '#E02D69',
      path: links.instagram || '#instagram-link',
    },
    {
      name: 'Linkedin',
      icon: 'eva:linkedin-fill',
      Color: '#007EBB',
      path: links.linkedin || '#linkedin-link',
    },
    {
      name: 'Twitter',
      icon: 'eva:twitter-fill',
      Color: '#00AAEC',
      path: links.twitter || '#twitter-link',
    },
  ];

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {S.map((social) => {
        const { name, icon, path, Color } = social;
        return simple ? (
          <Link key={name} href={path}>
            <Tooltip title={name} placement="top">
              <IconButton
                color="inherit"
                sx={{
                  ...(initialColor && {
                    color: Color,
                    '&:hover': {
                      bgcolor: alpha(Color, 0.08),
                    },
                  }),
                  ...sx,
                }}
                {...other}
              >
                <Iconify icon={icon} sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Tooltip>
          </Link>
        ) : (
          <Button
            key={name}
            href={path}
            color="inherit"
            variant="outlined"
            size="small"
            startIcon={<Iconify icon={icon} />}
            sx={{
              m: 0.5,
              flexShrink: 0,
              ...(initialColor && {
                color: Color,
                borderColor: Color,
                '&:hover': {
                  borderColor: Color,
                  bgcolor: alpha(Color, 0.08),
                },
              }),
              ...sx,
            }}
            {...other}
          >
            {name}
          </Button>
        );
      })}
    </Stack>
  );
}
