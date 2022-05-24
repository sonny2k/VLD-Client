// @mui
import { Button, Typography, TextField, Stack } from '@mui/material';
//
import { varFade, MotionInView } from '../../components/animate';

// ----------------------------------------------------------------------

export default function FaqsForm() {
  return (
    <Stack spacing={3}>
      <MotionInView variants={varFade().inUp}>
        <Typography variant="h4">Bạn vẫn chưa tìm được câu trả lời?</Typography>
        <br />
        <Typography variant="h4">Hãy đặt câu hỏi cho chúng tôi.</Typography>
      </MotionInView>

      <MotionInView variants={varFade().inUp}>
        <TextField fullWidth label="Họ và tên" />
      </MotionInView>

      <MotionInView variants={varFade().inUp}>
        <TextField fullWidth label="Email" />
      </MotionInView>

      <MotionInView variants={varFade().inUp}>
        <TextField fullWidth label="Chủ đề" />
      </MotionInView>

      <MotionInView variants={varFade().inUp}>
        <TextField fullWidth label="Nhập câu hỏi vào đây" multiline rows={4} />
      </MotionInView>

      <MotionInView variants={varFade().inUp}>
        <Button size="large" variant="contained">
          Đặt câu hỏi
        </Button>
      </MotionInView>
    </Stack>
  );
}
