import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo,useState } from 'react';
import * as React from 'react';
import unorm from 'unorm';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card,Avatar,Checkbox, Chip, Grid, Stack, TextField, Typography, Autocomplete,Table, InputAdornment, TableBody, TableCell, TableRow, TableContainer, TableHead, Tooltip, IconButton } from '@mui/material';
// hooks
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
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
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../../components/table';
import Scrollbar from '../../../../components/Scrollbar';
import Iconify from '../../../../components/Iconify';
import { InvoiceTableRow, InvoiceTableToolbar } from '../list';




// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'title', label: 'Tên thuốc', align: 'left' },
  { id: 'description', label: 'Mô tả', align: 'left' },
  { id: '' }
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

InvoiceNewEditForm.propTypes = {
  isEdit: PropTypes.array,
  prod: PropTypes.array,
};

export default function InvoiceNewEditForm({ isEdit, prod }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const [filterName, setFilterName] = useState('');

  function applySortFilter({ prod, comparator, filterName}) {
    const stabilizedThis = prod.map((el, index) => [el, index]);
  
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  
    prod = stabilizedThis.map((el) => el[0]);
  
    if (filterName) {
      prod = prod.filter((item) => unorm.nfkd(item.title).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1);
    }
  
    return prod;
  }

    const handleFilterName = (filterName) => {
      setFilterName(filterName);
      setPage(0);
    };

    const dataFiltered = applySortFilter({
      prod,
      comparator: getComparator(order, orderBy),
      filterName,
    });

    const denseHeight = dense ? 52 : 72;
  
    const isNotFound =
      (!dataFiltered.length && !!filterName);
     

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { title, description, image } = prod;


  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    imquantitys: Yup.array().min(1, 'Imquantitys is required'),
  });

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

  const handleRemoveAll = () => {
    setValue('imquantitys', []);
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ pt: 5, px: 5 }}>
      <Grid container>
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
            <Typography variant="body2">Giới tính:  </Typography>
            <Typography variant="body2">Cân nặng:  </Typography>
            <Typography variant="body2">Chiều cao:  </Typography>
          </Grid>
        </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>

              <RHFTextField name="pname" label="Tên toa thuốc" />

              <div>
              <RHFTextField name="diagnosis" multiline rows={4} label="Chuẩn đoán" />
              </div>

              <div>
              <RHFTextField name="symptom" label="Ghi chú" />
              </div>

              <div>
              {/* <InvoiceTableToolbar
              filterName={filterName}
              onFilterName={handleFilterName}
              />  */}
              <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
  
                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={prod.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        prod.map((row) => row._id)
                      )
                    }
                  />
  
                  <TableBody>
                  <TableRow hover selected={selected}>
                  {/* <TableCell padding="checkbox">
                        <Checkbox checked={selected} onClick={onSelectRow} />
                      </TableCell> */}

                      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={title} src={image} sx={{ mr: 2 }} />
                          <Typography variant="subtitle2" noWrap>
                            {title}
                          </Typography>
                      </TableCell>

                      <TableCell align="left">{description}</TableCell>
                    </TableRow>
  
                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, prod.length)} />
      
                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
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
      </Card>
    </FormProvider>
  );
}
