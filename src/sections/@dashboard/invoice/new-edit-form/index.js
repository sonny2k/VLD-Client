import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import * as React from 'react';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment, Table, TableBody, TableCell, TableRow, TableContainer, TableHead } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const columns = [
  {
    field: 'lastName',
    headerName: 'Sản phẩm',
    width: 100,
    editable: false,
  },
  {
    field: 'quantity',
    headerName: 'Số lượng',
    type: 'number',
    width: 90,
    editable: true,
  },
  {
    field: 'morningrate',
    headerName: 'Liều lượng buổi sáng',
    width: 170,
    editable: true,
  },
  {
    field: 'noonrate',
    headerName: 'Liều lượng buổi trưa',
    width: 170,
    editable: true,
  },
  {
    field: 'everate',
    headerName: 'Liều lượng buổi chiều',
    width: 180,
    editable: true,
  },
];

const rows = [
  { id: 1, lastName: '{pro.title}' , quantity: '' },
  { id: 2, lastName: 'Lannister', quantity: '' },
  { id: 3, lastName: 'Lannister',  quantity: '' },
  { id: 4, lastName: 'Stark', quantity: '' },
  { id: 5, lastName: 'Targaryen',  quantity: null },
  { id: 6, lastName: 'Melisandre', quantity: '' },
  { id: 7, lastName: 'Clifford', quantity: '' },
  { id: 8, lastName: 'Frances', quantity: '' },
  { id: 9, lastName: 'Roxie', quantity: '' },
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

InvoiceNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  prod: PropTypes.object.isRequired,
};

export default function InvoiceNewEditForm({ isEdit, prod }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { title } = prod;

  
  

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    imquantitys: Yup.array().min(1, 'Imquantitys is required'),
  });

  // const defaultValues = useMemo(
  //   () => ({
  //     name:  prod?.title || '',
  //     imquantitys: prod?.imquantity || [],
  //   }),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [prod]
  // );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // useEffect(() => {
  //   if (isEdit && prod) {
  //     reset(defaultValues);
  //   }
  //   if (!isEdit) {
  //     reset(defaultValues);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isEdit, prod]);

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Tạo toa thuốc thành công!' : 'Cập nhật thành công!');
      navigate(PATH_DASHBOARD.prescription.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'imquantitys',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('imquantitys', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.imquantitys?.filter((_file) => _file !== file);
    setValue('imquantitys', filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>

            <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Thông tin cơ bản
            </Typography>
            <Typography variant="body2">Triệu chứng: </Typography>
            <Typography variant="body2">Tiền sử bệnh: </Typography>
            <Typography variant="body2">Chẩn đoán: </Typography>
            </Grid>

            <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Thông tin bệnh nhân
            </Typography>
            <Typography variant="body2">Tên: </Typography>
            {/* {gender === 1 || gender === 2 ? ( */}
            <Typography variant="body2">Giới tính: </Typography>
            {/* ) : ( */}
            <Typography variant="body2">Không xác định </Typography>
            {/* )} */}
            <Typography variant="body2">Cân nặng: </Typography>
            <Typography variant="body2">Chiều cao:  </Typography>
          </Grid>

              <RHFTextField name="pname" label="Tên toa thuốc" />

              <div>
              <RHFTextField name="diagnosis" multiline rows={4} label="Chuẩn đoán" />
              </div>

              <div>
              <RHFTextField name="symptom" label="Ghi chú" />
              </div>

              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                rows={rows}
                columns={columns}
                pquantitySize={5}
                rowsPerPquantityOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                />
              </div>

            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Tạo mới toa thuốc' : 'Cập nhật'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
