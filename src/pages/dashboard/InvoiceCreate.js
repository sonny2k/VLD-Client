import { useEffect, useState } from 'react';
import unorm from 'unorm';
import { useSnackbar } from 'notistack';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Typography,
  Container,
  Table,
  TableBody,
  TableContainer,
  Button
} from '@mui/material';
import { InvoiceTableRow, InvoiceTableToolbar } from '../../sections/@dashboard/user/list';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import Scrollbar from '../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';

// sections
import InvoiceNewEditForm from '../../sections/@dashboard/invoice/new-edit-form';
import LoadingScreen from '../../components/LoadingScreen';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'title', label: 'Tên thuốc', align: 'left' },
  { id: 'description', label: 'Mô tả', align: 'left' },
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const columns = [
  { field: 'title', headerName: 'Tên thuốc', width: 130 },
  {
    field: 'quantity',
    headerName: 'Số lượng',
    type: 'number',
    width: 90,
    editable: true,
  },
  { field: 'morningrate', headerName: 'Liều lượng sáng', width: 150,editable: true,
},
  { field: 'noonrate', headerName: 'Liều lượng trưa', width: 150,editable: true,
},
  { field: 'everate', headerName: 'Liều lượng chiều', width: 160,editable: true,
},

];

let rows = [];
// ----------------------------------------------------------------------

export default function InvoiceCreate({consultation}) {
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
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const location = useLocation();

  const [prod, setProd] = useState([]);
  useEffect(() => {
    getProd();
  }, [prod]);
  const getProd = async () => {
    try {
      const res = await axios.get(`/api/admin/product/viewProduct`);
      setProd(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const [filterName, setFilterName] = useState('');

  function applySortFilter({ prod, comparator, filterName }) {
    const stabilizedThis = prod.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    prod = stabilizedThis.map((el) => el[0]);

    if (filterName) {
      prod = prod.filter(
        (item) => unorm.nfkd(item.title).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1
      );
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

  const isNotFound = !dataFiltered.length && !!filterName;

  const methods = useForm({
    resolver: yupResolver(),
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

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      // enqueueSnackbar(!isEdit ? 'Tạo toa thuốc thành công!' : 'Cập nhật thành công!');
      navigate(PATH_DASHBOARD.prescription.list);
    } catch (error) {
      console.error(error);
    }
  };

  const setRowsData = () => {
    if (selected.length > 0) {
      const result = prod.filter((medicine) => selected.includes(medicine._id));
      result.forEach((obj) => {
        obj.id = obj._id;
        delete obj._id;
      });
      console.log(result);
      rows = result;
    }
  };

  return prod !== null ? (
    <Page title="Toa thuốc: Tạo toa thuốc mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo toa thuốc mới"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Toa thuốc', href: PATH_DASHBOARD.prescription.list },
            { name: 'Toa thuốc mới' },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ pt: 5, px: 5 }}>
            <Grid container>
              <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Thông tin cơ bản
                </Typography>
                <Typography variant="body2">Triệu chứng: {location.state.symptom1}</Typography>
                <Typography variant="body2">Tiền sử bệnh: {location.state.pastmedicalhistory1}</Typography>
                <Typography variant="body2">Tiền sử dị ứng thuốc: {location.state.drughistory1}</Typography>
                <Typography variant="body2">Tiền sử gia đình: {location.state.familyhistory1}</Typography>
              </Grid>

              <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Thông tin bệnh nhân
                </Typography>
                <Typography variant="body2">Họ và tên: {location.state.name}</Typography>
                <Typography variant="body2">Giới tính: {location.state.gender1 === 1 && 'Nam' || location.state.gender1 === 2 && 'Nữ' || location.state.gender1 === 3 && 'Không xác định' || location.state.gender1 === null && 'Không xác định'}</Typography>
                <Typography variant="body2">Cân nặng: {location.state.weight1}</Typography>
                <Typography variant="body2">Chiều cao: {location.state.height1}</Typography>
              </Grid>
            </Grid>
            <Grid container>
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
                      <InvoiceTableToolbar filterName={filterName} onFilterName={handleFilterName} />
                      <Scrollbar>
                        <TableContainer sx={{ minWidth: "100%", position: 'relative' }}>
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
                              {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prod) => (
                                <InvoiceTableRow
                                  key={prod._id}
                                  row={prod}
                                  selected={selected.includes(prod._id)}
                                  onSelectRow={() => onSelectRow(prod._id)}
                                />
                              ))}

                              <TableEmptyRows
                                height={denseHeight}
                                emptyRows={emptyRows(page, rowsPerPage, prod.length)}
                              />

                              <TableNoData isNotFound={isNotFound} />
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Scrollbar>
                      
                      <div style = {{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button variant="text" size="large" onClick={() => setRowsData()}>Thêm sản phẩm</Button>
                      </div>
                      
                      <div style={{ height: 300, width: '100%' }}>
                        <DataGrid rows={rows} columns={columns} experimentalFeatures={{ newEditingApi: true }} pageSize={5}
                        rowsPerPageOptions={[5]} />
                      </div>
                      <Stack alignItems="flex-end" spacing={3} sx={{ mt: 3 }}>
                        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                          Tạo mới toa thuốc
                        </LoadingButton>
                      </Stack>
                    </div>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Stack alignItems="flex-end" spacing={3} sx={{ mt: 3 }}/>
              </Grid>
            </Grid>
          </Card>
        </FormProvider>
      </Container>
    </Page>
  ) : (
    <LoadingScreen />
  );
}
