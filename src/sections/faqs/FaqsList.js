// @mui
import { Accordion, Typography, AccordionSummary, AccordionDetails } from '@mui/material';
// _mock_
import { _faqs } from '../../_mock';
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

export default function FaqsList() {
  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20} />}>
          <Typography variant="subtitle1">Văn Lang Doctor bao gồm những dịch vụ nào?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Văn Lang Doctor là một nền tảng công nghệ trực tuyến cung cấp cho người dùng những dịch vụ chăm sóc sức khỏe
            với những tính năng:
            <br />
            + Xem hồ sơ sức khỏe điện tử
            <br />
            + Đặt lịch khám
            <br />
            + Bác sĩ riêng
            <br />
            + Khám bệnh trực tiếp với bác sĩ qua video call
            <br />+ kê đơn thuốc tận tình, chu đáo
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20} />}>
          <Typography variant="subtitle1">Thời gian làm việc của bác sĩ?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Tùy vào ngày làm việc mà bác sĩ chọn và khung giờ làm việc bình thường bắt đầu từ 7:00 đến 23:00.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20} />}>
          <Typography variant="subtitle1">Làm cách nào để có thể khám bệnh online?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Bước 1: Đăng nhập tài khoản
            <br />
            Bước 2: Vào Danh sách bác sĩ để chọn bác sĩ cần được tư vấn
            <br />
            Bước 3: Chọn Hẹn khám và nhập thông tin cá nhân, triệu chứng và ngày giờ hẹn
            <br />
            Bước 4: Nhấp Hẹn tư vấn.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20} />}>
          <Typography variant="subtitle1">Làm cách nào có thể liên hệ được với Văn Lang Doctor?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Vui lòng liên hệ qua email của Văn Lang Doctor: support@vanlangdoctor.tech</Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
