// @mui
import { Button, Typography, TextField, Stack } from '@mui/material';
// components
import { MotionInView, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

export default function ContactForm() {
  return (
    <Stack spacing={5}>
      <MotionInView variants={varFade().inUp}>
        <Typography variant="h3">
          Hãy liên hệ cho chúng tôi <br />
          Chúng tôi rất vui khi được lắng nghe bạn.
        </Typography>
      </MotionInView>

      <Stack spacing={3}>
        <MotionInView variants={varFade().inUp}>
          <TextField fullWidth label="Họ tên" />
        </MotionInView>

        <MotionInView variants={varFade().inUp}>
          <TextField fullWidth label="Email" />
        </MotionInView>

        <MotionInView variants={varFade().inUp}>
          <TextField fullWidth label="Chủ đề" />
        </MotionInView>

        <MotionInView variants={varFade().inUp}>
          <TextField fullWidth label="Hãy để lại lời nhắn ở đây" multiline rows={4} />
        </MotionInView>
      </Stack>

      <MotionInView variants={varFade().inUp}>
        <Button size="large" variant="contained">
          Đồng ý
        </Button>
      </MotionInView>
    </Stack>
  );
}
