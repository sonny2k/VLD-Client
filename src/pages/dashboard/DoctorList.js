import { useState, useEffect } from 'react';
import { paramCase } from 'change-case';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import unorm from 'unorm';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// utils
import axios from '../../utils/axios';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { DoctorTableToolbar, DoctorTableRow } from '../../sections/@dashboard/user/list';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['Tất cả', 'chờ xác nhận', 'chờ khám', 'bị từ chối', 'đã hoàn thành'];

const DEPARTMENT_OPTIONS = [
  'Tất cả',
  'chuyên khoa tim mạch',
  'chuyên khoa nội',
  'chuyên khoa ngoại',
  'chuyên khoa thần kinh',
  'chuyên khoa nhãn khoa',
  'chuyên khoa tai mũi họng',
  'chuyên khoa răng-hàm-mặt',
  'chuyên khoa ung bướu',
];

const TABLE_HEAD = [
  { id: 'name', label: 'Người hẹn', align: 'left' },
  { id: 'date', label: 'Ngày', align: 'left' },
  { id: 'hour', label: 'Giờ', align: 'left' },
  { id: 'pastmedicalhistory', label: 'Tiền sử bệnh', align: 'center' },
  { id: 'status', label: 'Trạng thái', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function DoctorList() {
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

  const [loaded, setLoaded] = useState(false);

  const [consult, setConsult] = useState([]);

  useEffect(() => {
    async function getConsult() {
      const URL = '/api/doctor/consultation/viewlistconsult';
      try {
        const res = await axios.get(URL);
        setConsult(res.data);
        if (res.data) {
          setLoaded(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getConsult();
  }, [consult]);

  const [filterName, setFilterName] = useState('');

  const [filterDepartment, setFilterDepartment] = useState('Tất cả');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  function applySortFilter({ consult, comparator, filterName, filterStatus, filterRole, filterDepartment }) {
    const stabilizedThis = consult.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    consult = stabilizedThis.map((el) => el[0]);

    if (filterName) {
      consult = consult.filter(
        (item) =>
          unorm.nfkd(item.user.account.lname).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1 ||
          unorm.nfkd(item.user.account.fname).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1
      );
    }

    if (filterStatus !== 'Tất cả') {
      consult = consult.filter((item) => item.status === filterStatus);
    }

    if (filterDepartment !== 'Tất cả') {
      consult = consult.filter(
        (item) =>
          unorm.nfkd(item.doctor.department).toLowerCase().indexOf(unorm.nfkd(filterDepartment).toLowerCase()) !== -1
      );
    }

    return consult;
  }

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterDepartment = (event) => {
    setFilterDepartment(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = consult.filter((row) => row._id !== id);
    setSelected([]);
    setConsult(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = consult.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setConsult(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(`${PATH_DASHBOARD.user.root}/detail/${paramCase(id)}`);
  };

  const handlePrescription = (id) => {
    navigate(`${PATH_DASHBOARD.prescription.root}/${paramCase(id)}`);
  };

  const cancel = async (_id, doctor, date, hour, excuse) => {
    try {
      await axios.post('/api/doctor/consultation/cancelconsultation', {
        _id,
        doctor,
        date,
        hour,
        excuse,
      });
      enqueueSnackbar('Từ chối buổi hẹn thành công');
      navigate(PATH_DASHBOARD.user.doctorlist);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!', { variant: 'error' });
    }
  };

  const confirm = async (_id) => {
    try {
      await axios.post('/api/doctor/consultation/confirmconsultation', {
        _id,
      });
      enqueueSnackbar('Xác nhận buổi hẹn thành công');
      navigate(PATH_DASHBOARD.user.doctorlist);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!', { variant: 'error' });
    }
  };

  const dataFiltered = applySortFilter({
    consult,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    filterDepartment,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterDepartment) ||
    (!dataFiltered.length && !!filterStatus);

  if (consult.length > 0) {
    return (
      <Page title="Lịch hẹn thăm khám">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Lịch hẹn"
            links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Lịch hẹn' }]}
          />

          <Card>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={filterStatus}
              onChange={onChangeFilterStatus}
              sx={{ px: 2, bgcolor: 'background.neutral' }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab disableRipple key={tab} label={tab} value={tab} />
              ))}
            </Tabs>

            <Divider />

            <DoctorTableToolbar
              filterName={filterName}
              filterDepartment={filterDepartment}
              onFilterName={handleFilterName}
              onFilterDepartment={handleFilterDepartment}
              optionsDepartment={DEPARTMENT_OPTIONS}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                {selected.length > 0 && (
                  <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={consult.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        consult.map((row) => row._id)
                      )
                    }
                    actions={
                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                )}

                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={consult.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        consult.map((row) => row._id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <DoctorTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onViewPrescription={() => handlePrescription(row._id)}
                        onCancel={(excuse) => cancel(row._id, row.doctor, row.date, row.hour, excuse)}
                        onConfirm={() => confirm(row._id)}
                      />
                    ))}

                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, consult.length)} />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: 'relative' }}>
              <TablePagination
                labelRowsPerPage="Số dòng mỗi trang:"
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={dataFiltered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />

              <FormControlLabel
                control={<Switch checked={dense} onChange={onChangeDense} />}
                label="Thu gọn"
                sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
              />
            </Box>
          </Card>
        </Container>
      </Page>
    );
  }

  if (consult.length === 0 && loaded === false) {
    return <LoadingScreen />;
  }

  if (consult.length === 0 && loaded === true) {
    return (
      <Page title="Danh sách lịch hẹn">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Lịch hẹn"
            links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Lịch hẹn' }]}
          />

          <Card>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={filterStatus}
              onChange={onChangeFilterStatus}
              sx={{ px: 2, bgcolor: 'background.neutral' }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab disableRipple key={tab} label={tab} value={tab} />
              ))}
            </Tabs>

            <Divider />

            <DoctorTableToolbar
              filterName={filterName}
              filterDepartment={filterDepartment}
              onFilterName={handleFilterName}
              onFilterDepartment={handleFilterDepartment}
              optionsDepartment={DEPARTMENT_OPTIONS}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                {selected.length > 0 && (
                  <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={consult.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        consult.map((row) => row._id)
                      )
                    }
                    actions={
                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                )}

                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={consult.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        consult.map((row) => row._id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <DoctorTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, consult.length)} />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: 'relative' }}>
              <TablePagination
                labelRowsPerPage="Số dòng mỗi trang:"
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={dataFiltered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />

              <FormControlLabel
                control={<Switch checked={dense} onChange={onChangeDense} />}
                label="Thu gọn"
                sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
              />
            </Box>
          </Card>
        </Container>
      </Page>
    );
  }
}
