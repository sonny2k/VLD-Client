import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
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

  const [check, setCheck] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    pname: Yup.string().required('Vui lòng nhập tên toa thuốc'),
    diagnosis: Yup.string().required('Vui lòng nhập chẩn đoán'),
  });

  const defaultValues = useMemo(() => ({
    consultation: `${id}`,
    pname: pname || '',
    diagnosis: diagnosis || '',
    note: note || '',
    medicines: loadedmeds || [{ product: '', quantity: '', rate: '', mednote: '' }],
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

  const newPrescription = {
    ...values,
    medicines: values.medicines.map((medicine) => ({
      ...medicine,
    })),
  };

  const updatePrescription = {
    ...values,
    medicines: values.medicines.map((medicine) => ({
      quantity: medicine.quantity,
      product: medicine.product._id,
      rate: medicine.rate,
      mednote: medicine.mednote,
    })),
  };

  const handleCreate = async () => {
    try {
      if (values.medicines.some((el) => el.product === '' || el.quantity === '' || el.rate === '')) {
        enqueueSnackbar('Vui lòng chọn thuốc và điền đầy đủ thông tin!', {
          variant: 'error',
        });
      }
      if (isEdit === true) {
        await axios.put(`/api/doctor/prescription/updatePrescription/${idPre}`, {
          ...values,
          medicines: values.medicines.map((medicine) => ({
            quantity: medicine.quantity,
            product: medicine.product._id,
            rate: medicine.rate,
            mednote: medicine.mednote,
          })),
        });
        enqueueSnackbar('Cập nhật toa thuốc thành công');
        navigate(PATH_DASHBOARD.prescription.view(id));
      } else {
        await axios.post('/api/doctor/prescription/createPrescription', {
          ...values,
          medicines: values.medicines.map((medicine) => ({
            ...medicine,
          })),
        });
        enqueueSnackbar('Tạo toa thuốc thành công');
        navigate(PATH_DASHBOARD.user.doctorlist);
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
        <LoadingButton size="large" variant="contained" loading={isSubmitting} onClick={handleSubmit(handleCreate)}>
          {isEdit === true ? `Lưu thay đổi` : `Tạo toa thuốc`}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
