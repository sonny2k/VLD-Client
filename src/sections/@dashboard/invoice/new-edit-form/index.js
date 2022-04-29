import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// mock

// components
import { FormProvider } from '../../../../components/hook-form';
//
import InvoiceNewEditDetails from './InvoiceNewEditDetails';
import InvoiceNewEditAddress from './InvoiceNewEditAddress';
import InvoiceNewEditStatusDate from './InvoiceNewEditStatusDate';

// ----------------------------------------------------------------------

InvoiceNewEditForm.propTypes = {
  medicines: PropTypes.array,
};

export default function InvoiceNewEditForm({
  medicines,
  id,
  name,
  gender,
  weight,
  height,
  symptom,
  pastmedicalhistory,
  drughistory,
  familyhistory,
}) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const NewUserSchema = Yup.object().shape({
    pname: Yup.string().required('Vui lòng nhập tên toa thuốc'),
    diagnosis: Yup.string().required('Vui lòng nhập chẩn đoán'),
    createDate: Yup.object().shape({
      title: Yup.string().required('Vui lòng nhập chẩn đoán'),
      rate: Yup.string().required('Vui lòng nhập chẩn đoán'),
      specdes: Yup.string().required('Vui lòng nhập chẩn đoán'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      invoiceNumber: medicines?.invoiceNumber || '17099',
      createDate: medicines?.createDate || null,
      dueDate: medicines?.dueDate || null,
      taxes: medicines?.taxes || '',
      status: medicines?.status || 'draft',
      discount: medicines?.discount || '',
      invoiceFrom: medicines?.invoiceFrom || '',
      invoiceTo: medicines?.invoiceTo || null,
      items: medicines?.items || [{ title: '', quantity: '', price: '', total: '' }],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [medicines]
  );

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

  useEffect(() => {
    if (medicines) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicines]);

  const newInvoice = {
    ...values,
    items: values.items.map((item) => ({
      ...item,
      total: item.quantity * item.price,
    })),
  };

  const handleSaveAsDraft = async () => {
    setLoadingSave(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setLoadingSave(true);
      navigate(PATH_DASHBOARD.invoice.list);
      console.log(JSON.stringify(newInvoice, null, 2));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAndSend = async () => {
    setLoadingSend(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setLoadingSend(false);
      navigate(PATH_DASHBOARD.invoice.list);
      console.log(JSON.stringify(newInvoice, null, 2));
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
        <InvoiceNewEditStatusDate />
        <InvoiceNewEditDetails medicines={medicines} />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          Tạo toa thuốc
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
