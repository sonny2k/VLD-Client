// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
import useToggle from '../../../../hooks/useToggle';
// _mock
import { _invoiceAddressFrom, _invoiceAddressTo } from '../../../../_mock/_invoice';
// components
import InvoiceAddressListDialog from './InvoiceAddressListDialog';

// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress({
  name,
  gender,
  weight,
  height,
  symptom,
  pastmedicalhistory,
  drughistory,
  familyhistory,
}) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive('up', 'md');

  const values = watch();

  const { toggle: openTo, onOpen: onOpenTo, onClose: onCloseTo } = useToggle();

  const { invoiceTo } = values;

  return (
    <Stack
      spacing={{ xs: 2, md: 5 }}
      direction={{ xs: 'column', md: 'row' }}
      divider={<Divider flexItem orientation={upMd ? 'vertical' : 'horizontal'} sx={{ borderStyle: 'dashed' }} />}
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Hồ sơ bệnh lý
          </Typography>
        </Stack>

        <MedicalInfo
          symptom={symptom}
          pastmedicalhistory={pastmedicalhistory}
          drughistory={drughistory}
          familyhistory={familyhistory}
        />
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Thông tin bệnh nhân
          </Typography>

          {/* <Button
            size="small"
            startIcon={<Iconify icon={invoiceTo ? 'eva:edit-fill' : 'eva:plus-fill'} />}
            onClick={onOpenTo}
          >
            Nhập toa thuốc có sẵn
          </Button> */}

          <InvoiceAddressListDialog
            open={openTo}
            onClose={onCloseTo}
            selected={(selectedId) => invoiceTo?.id === selectedId}
            onSelect={(address) => setValue('invoiceTo', address)}
            addressOptions={_invoiceAddressTo}
          />
        </Stack>

        <Info name={name} gender={gender} weight={weight} height={height} />
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Info({ name, gender, weight, height }) {
  return (
    <>
      <Typography variant="body2">
        Họ tên:&nbsp;
        <Typography component="span" variant="subtitle2" color="text.primary">
          {name}
        </Typography>
      </Typography>
      <Typography variant="body2">
        Giới tính:&nbsp;
        <Typography component="span" variant="subtitle2" color="text.primary">
          {(gender === 1 && 'Nam') ||
            (gender === 2 && 'Nữ') ||
            (gender === 3 && 'Không xác định') ||
            (gender === null && 'Không xác định')}
        </Typography>
      </Typography>
      <Typography variant="body2">
        Chiều cao:&nbsp;
        <Typography component="span" variant="subtitle2" color="text.primary">
          {height} Cm
        </Typography>
      </Typography>
      <Typography variant="body2">
        Cân nặng:&nbsp;
        <Typography component="span" variant="subtitle2" color="text.primary">
          {weight}Kg
        </Typography>
      </Typography>
    </>
  );
}

function MedicalInfo({ symptom, pastmedicalhistory, drughistory, familyhistory }) {
  return (
    <>
      <Typography variant="body2">
        Triệu chứng:&nbsp;
        <Typography component="span" variant="subtitle2" color="text.primary">
          {symptom}
        </Typography>
      </Typography>
      <Typography variant="body2">
        Tiền sử bệnh:&nbsp;
        <Typography component="span" variant="subtitle2" color="text.primary">
          {pastmedicalhistory}
        </Typography>
      </Typography>
      <Typography variant="body2">
        Tiền sử dị ứng thuốc:&nbsp;
        <Typography component="span" variant="subtitle2" color="text.primary">
          {drughistory}
        </Typography>
      </Typography>
      <Typography variant="body2">
        Tiền sử gia đình:&nbsp;
        <Typography component="span" variant="subtitle2" color="text.primary">
          {familyhistory}
        </Typography>
      </Typography>
    </>
  );
}
