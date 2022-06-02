import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Button } from '@mui/material';
import { icd10 } from '../../../../_mock/_icd10';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import axios from '../../../../utils/axios';
// components
import { FormProvider } from '../../../../components/hook-form';
//
import InvoiceNewEditDetails from './InvoiceNewEditDetails';
import InvoiceNewEditAddress from './InvoiceNewEditAddress';
import InvoiceNewEditStatusDate from './InvoiceNewEditStatusDate';

// ----------------------------------------------------------------------

InvoiceNewEditForm.propTypes = {
  products: PropTypes.array,
};

export default function InvoiceNewEditForm({
  products,
  id,
  name,
  gender,
  weight,
  height,
  symptom,
  pastmedicalhistory,
  drughistory,
  familyhistory,
  pname,
  diagnosis,
  note,
  loadedmeds,
  isEdit,
  idPre,
}) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    pname: Yup.string().required('Vui lòng nhập tên toa thuốc'),
    diagnosis: Yup.string().required('Vui lòng nhập chẩn đoán'),
  });

  const defaultValues = useMemo(() => ({
    consultation: `${id}`,
    pname: pname || '',
    icd10: '',
    diagnosis: diagnosis || '',
    note: note || '',
    medicines: loadedmeds || [{ product: '', quantity: '', rate: '' }],
  }));

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  console.log(values);

  const back = async () => {
    if (isEdit === true) {
      navigate(PATH_DASHBOARD.prescription.view(id));
    } else {
      navigate(PATH_DASHBOARD.user.edit(id));
    }
  };

  const handleCreate = async () => {
    const uniqueValues = new Set(values.medicines.map((v) => v.product._id));
    try {
      if (values.medicines.length === 0) {
        enqueueSnackbar('Vui lòng chọn thuốc và điền đầy đủ thông tin!', {
          variant: 'error',
        });
      }

      if (
        !isEdit &&
        values.medicines.some((el) => el.product === '' || el.quantity === '' || el.rate === '' || el.icd10 === null)
      ) {
        enqueueSnackbar('Vui lòng chọn thuốc và điền đầy đủ thông tin!', {
          variant: 'error',
        });
      } else if (
        !isEdit &&
        values.medicines.some((el) => (el.product === null && el.quantity === '') || el.rate === '' || el.icd10 === '')
      ) {
        enqueueSnackbar('Vui lòng chọn thuốc và điền đầy đủ thông tin!', {
          variant: 'error',
        });
      } else if (!isEdit && values.medicines.some((el) => el.product === null || el.quantity === 0 || el.rate === '')) {
        enqueueSnackbar('Vui lòng điền số lượng lớn hơn 0!', {
          variant: 'error',
        });
      } else if (uniqueValues.size < values.medicines.length) {
        enqueueSnackbar('Sản phẩm thuốc trùng lặp, vui lòng kiểm tra lại', { variant: 'error' });
      } else if (!isEdit && values.medicines.length > 0) {
        await axios.post('/api/doctor/prescription/createPrescription', {
          ...values,
          medicines: values.medicines.map((medicine) => ({
            quantity: medicine.quantity,
            product: medicine.product._id,
            rate: medicine.rate,
          })),
        });
        enqueueSnackbar('Tạo toa thuốc thành công');
        navigate(PATH_DASHBOARD.prescription.view(id));
      }

      if (isEdit === true && values.medicines.some((el) => el.product === '' || el.quantity === '' || el.rate === '')) {
        enqueueSnackbar('Vui lòng chọn thuốc và điền đầy đủ thông tin!', {
          variant: 'error',
        });
      } else if (
        isEdit === true &&
        values.medicines.some((el) => el.product === null || el.quantity === '' || el.rate === '')
      ) {
        enqueueSnackbar('Vui lòng chọn thuốc và điền đầy đủ thông tin!', {
          variant: 'error',
        });
      } else if (!isEdit && values.medicines.some((el) => el.product === null || el.quantity === 0 || el.rate === '')) {
        enqueueSnackbar('Vui lòng điền số lượng lớn hơn 0!', {
          variant: 'error',
        });
      } else if (uniqueValues.size < values.medicines.length) {
        enqueueSnackbar('Sản phẩm thuốc trùng lặp, vui lòng kiểm tra lại', { variant: 'error' });
      } else if (isEdit === true && values.medicines.length > 0) {
        await axios.put(`/api/doctor/prescription/updatePrescription/${idPre}`, {
          ...values,
          medicines: values.medicines.map((medicine) => ({
            quantity: medicine.quantity,
            product: medicine.product._id,
            rate: medicine.rate,
          })),
        });
        enqueueSnackbar('Cập nhật toa thuốc thành công');
        navigate(PATH_DASHBOARD.prescription.view(id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditAddress
          name={name}
          gender={gender}
          weight={weight}
          height={height}
          symptom={symptom}
          pastmedicalhistory={pastmedicalhistory}
          drughistory={drughistory}
          familyhistory={familyhistory}
        />
        <InvoiceNewEditStatusDate isEdit={isEdit} />
        <InvoiceNewEditDetails isEdit={isEdit} loadedmeds={loadedmeds} products={products} />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button size="large" variant="contained" color="inherit" onClick={back}>
          Trở về
        </Button>
        <LoadingButton size="large" variant="contained" loading={isSubmitting} onClick={handleSubmit(handleCreate)}>
          {isEdit === true ? `Lưu thay đổi` : `Tạo toa thuốc`}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
