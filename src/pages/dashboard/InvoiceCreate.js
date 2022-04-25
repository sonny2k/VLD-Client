import { useEffect, useState, useCallback } from 'react';
import unorm from 'unorm';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataGrid, GridActionsCellItem, useGridApiRef, viVN, GridPreProcessEditCellProps   } from '@mui/x-data-grid';
import { format } from 'date-fns';
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
  Button,
  Divider,
  Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { InvoiceTableRow, InvoiceTableToolbar } from '../../sections/@dashboard/user/list';
// utils
import axios from '../../utils/axios';
import createAvatar from '../../utils/createAvatar';
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
let rows = [];

export default function InvoiceCreate() {
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

  const cursor = true;

  const CreatePrescriptionSchema = Yup.object().shape({
    pname: Yup.string().required('Vui lòng điền tên toa thuốc'),
    diagnosis: Yup.string().required('Vui lòng cung cấp chuẩn đoán')
  });

  const methods = useForm({
    resolver: yupResolver(CreatePrescriptionSchema)
  });

  const TABLE_HEAD = [
    { id: 'title', label: 'Tên thuốc', align: 'left' },
    { id: 'description', label: 'Mô tả', align: 'left' },
  ];
  
  const columns = [
    {
      field: "image",
      headerName: "Hình ảnh",
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <>
          <Avatar
          src={params.row.image}
          alt={params.row.title}
          color={params.row.image ? 'default' : createAvatar(params.row.title).color}
        >
          {createAvatar(params.row.title).name}
        </Avatar>
          </>
        );
      }
    },
    { field: 'title', headerName: 'Tên thuốc', width: 150, headerAlign: 'center', align: 'center'},
    {
      field: 'quantity',
      headerName: 'Số lượng',
      type: 'number',
      width: 90,
      editable: true,
      headerAlign: 'center',
      align: 'center',
    },
    { field: 'morningrate', headerName: 'Liều lượng sáng', width: 150, editable: true, headerAlign: 'center', align: 'center'},
    { field: 'noonrate', headerName: 'Liều lượng trưa', width: 150, editable: true, headerAlign: 'center', align: 'center'},
    { field: 'everate', headerName: 'Liều lượng chiều', width: 150, editable: true, headerAlign: 'center', align: 'center'},
    { field: 'specdes', headerName: 'Quy cách', width: 150, editable: true, headerAlign: 'center', align: 'center'},
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const apiRef = useGridApiRef();

  const location = useLocation();

  const [med, setMed] = useState([]);

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

  const onSubmit = async (data, params) => {
    try {
      if (params) {
        await axios.post('/api/doctor/prescription/createPrescription', {
          consultation: location.state.id,
          pname: data.pname,
          diagnosis: data.diagnosis,
          note: data.note
        });
      }
      enqueueSnackbar('Vui lòng thêm thuốc vào toa!',
      {
        variant: "error"
      });
    } catch (error) {
      console.error(error);
    }
  };

  const setRowsData = () => {
    if (selected.length > 0) {
      const result = prod.filter((medicine) => selected.includes(medicine._id));
      result.forEach((obj) => {
        obj.id = obj._id;
      });
      console.log(result);
      rows = result;
    }
  };

  const handleRowEditCommit = useCallback(
    (params) => {
      console.log(params.row)
    },
  );

  const handleDeleteClick = useCallback(
    (params) => {
      const id = params.id;
      const deletearray = [...rows];
      deletearray.splice(id, 1);
      rows = deletearray;
  });

  return prod !== null ? (
    <Page title="Toa thuốc: Tạo toa thuốc mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo toa thuốc mới"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: `Chi tiết lịch hẹn ngày ${format(new Date(location.state.date1), 'dd/MM/yyyy')} lúc ${location.state.hour1}`, href: PATH_DASHBOARD.user.edit(location.state.id) },
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
                    <RHFTextField autoFocus={cursor} name="pname" label="Tên toa thuốc" />

                    <div>
                      <RHFTextField name="diagnosis" multiline rows={4} label="Chuẩn đoán" />
                    </div>

                    <div>
                      <RHFTextField name="note" label="Ghi chú" />
                    </div>

                    <Divider sx={{ borderStyle: 'dashed' }} />

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
                      
                      <div style = {{display: 'flex', justifyContent: 'flex-end', }} spacing={3}>
                        <Button variant="text" onClick={() => setRowsData()}>Thêm thuốc</Button>
                      </div>

                      <Divider sx={{ borderStyle: 'dashed' }} />
                      
                      <div style={{ height: 300, width: '100%' }}>
                        <DataGrid localeText={viVN} apiRef={apiRef} rows={rows} columns={columns} experimentalFeatures={{ newEditingApi: true }} pageSize={5}
                        rowsPerPageOptions={[5]} onCellFocusOut={handleRowEditCommit} 
                        components={{
                          NoRowsOverlay: () => (
                            <Stack height="100%" alignItems="center" justifyContent="center">
                              Chưa có thuốc nào được chọn
                            </Stack>
                          ),
                          NoResultsOverlay: () => (
                            <Stack height="100%" alignItems="center" justifyContent="center">
                              Không tìm thấy thuốc này
                            </Stack>
                          )
                        }}
                        />
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
