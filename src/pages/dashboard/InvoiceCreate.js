import { useEffect,useState} from 'react';
import unorm from 'unorm';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card,Avatar,Checkbox, Chip, Grid, Stack,Box, TextField, Typography, Container, Autocomplete,Table, InputAdornment, TableBody, TableCell, TableRow, TableContainer, TableHead, Tooltip, IconButton } from '@mui/material';
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
import {FormProvider, RHFTextField}  from '../../components/hook-form';
import Scrollbar from '../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';


// sections
import InvoiceNewEditForm from '../../sections/@dashboard/invoice/new-edit-form';
import LoadingScreen from '../../components/LoadingScreen';
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

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];
// ----------------------------------------------------------------------

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

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();  

  const [prod, setProd] = useState([]);
  useEffect(() => {
    getProd();
  }, [prod]);
  const getProd = async () => {
    try {
      const res = await axios.get(`/api/admin/product/viewProduct`)
      setProd(res.data);
    } catch (err) {
      console.error(err);
    }
  };
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
              <InvoiceTableToolbar
              filterName={filterName}
              onFilterName={handleFilterName}
              /> 
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
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prod) => (
                        <InvoiceTableRow
                          key={prod._id}
                          row={prod}
                          selected={selected.includes(prod._id)}
                          onSelectRow={() => onSelectRow(prod._id)}
                        />
                      ))}
  
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
        <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
      />
        </div>
        <Grid item xs={12} md={12}>
        <Stack alignItems="flex-end"  sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {'Tạo mới toa thuốc'}
            </LoadingButton>
          </Stack>
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
