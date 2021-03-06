import { useState, useEffect } from 'react';
import { paramCase } from 'change-case';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import unorm from 'unorm';
import { useSnackbar } from 'notistack';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import LoadingScreen from '../../components/LoadingScreen';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// utils
import axios from '../../utils/axios';
import { getDoc } from '../../redux/slices/doctor';

// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { DocTableToolbar, DocTableRow } from '../../sections/@dashboard/user/list';
// ----------------------------------------------------------------------
const ROLE_OPTIONS = ['Tất cả'];

const ROLE_OPTIONS1 = ['Tất cả', 'Kích hoạt', 'Vô hiệu hóa'];

const TABLE_HEAD = [
  { id: 'name', label: 'Bác sĩ', align: 'left' },
  { id: 'phone', label: 'Số điện thoại', align: 'center' },
  { id: 'department', label: 'Chuyên khoa', align: 'center' },
  { id: 'status', label: 'Trạng thái', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function DocList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    selected1,
    setSelected,
    setSelected1,
    onSelectRow,
    onSelectAllRows,
    onSelectRow1,
    onSelectAllRows1,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [doctors, setDoctors] = useState([]);

  const { docs } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(getDoc());
    setDoctors(docs);
  }, [dispatch, docs]);   
  // useEffect(() => {
  //   async function fetchDoctors() {
  //     const URL = '/api/home/doctor';
  //     try {
  //       const res = await axios.get(URL);
  //       setDoctors(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchDoctors();
  // }, [doctors]);

  const [dep, setDep] = useState([]);

  useEffect(() => {
    getDeps();
  }, [dep]);

  const getDeps = async () => {
    try {
      const res = await axios.get('/api/admin/department/viewListDepartment');
      setDep(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Tất cả');

  const [filterRole1, setFilterRole1] = useState('Tất cả');

  // const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  function applySortFilter({ doctors, comparator, filterName, filterRole, dep, filterRole1 }) {
    const stabilizedThis = doctors.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    doctors = stabilizedThis.map((el) => el[0]);

    if (filterName) {
      doctors = doctors.filter(
        (item) =>
          unorm.nfkd(item.account.lname).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1 ||
          unorm.nfkd(item.account.fname).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1 ||
          unorm
            .nfkd(`0${item.account.phone.slice(3)}`)
            .toLowerCase()
            .indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1
      );
    }

    if (dep.length > 0 && ROLE_OPTIONS.length === 1) {
      dep.map((item) => ROLE_OPTIONS.push(item.name));
    }

    if (filterRole !== 'Tất cả') {
      doctors = doctors.filter(
        (item) => unorm.nfkd(item.department).toLowerCase().indexOf(unorm.nfkd(filterRole).toLowerCase()) !== -1
      );
    }

    if (filterRole1 !== 'Tất cả') {
      doctors = doctors.filter(
        (item) =>
          unorm
            .nfkd(item.status === 0 ? 'Vô hiệu hóa' : 'Kích hoạt')
            .toLowerCase()
            .indexOf(unorm.nfkd(filterRole1).toLowerCase()) !== -1
      );
    }

    return doctors;
  }

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleFilterRole1 = (event) => {
    setFilterRole1(event.target.value);
  };

  const handleFilterDep = (event) => {
    setDep(event.target.value);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteRows = async (selected, selected1) => {
    try {
      await axios.post(`/api/admin/doctor/deleteDoctor`, {
        data: selected,
        accdata: selected1,
      });
      enqueueSnackbar('Xóa bác sĩ thành công!');
    } catch (error) {
      console.error(error);
    }
    const deleteRows = doctors.filter((row) => !selected.includes(row._id) && !selected1.includes(row.account._id));
    setSelected([]);
    setSelected1([]);
    setDoctors(deleteRows);
  };

  const handleEditRow = async (
    _id,
    department,
    educationplace,
    workcertificate,
    level,
    degree,
    description,
    excellence,
    workhistory,
    education,
    name
  ) => {
    navigate(PATH_DASHBOARD.user.docedit, {
      state: {
        id1: _id,
        department1: department,
        educationplace1: educationplace,
        workcertificate1: workcertificate,
        level1: level,
        degree1: degree,
        description1: description,
        excellence1: excellence,
        workhistory1: workhistory,
        education1: education,
        fname1: name,
      },
    });
  };

  const dataFiltered = applySortFilter({
    doctors,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterRole1,
    dep,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && Boolean(filterName);

  return doctors !== null ? (
    <Page title="Danh sách bác sĩ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách bác sĩ"
          links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Danh sách tài khoản bác sĩ' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.doccreate}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Thêm bác sĩ
            </Button>
          }
        />

        <Card>
          <Divider />

          <DocTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            filterRole1={filterRole1}
            filterDep={dep}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            onFilterRole1={handleFilterRole1}
            optionsDep={ROLE_OPTIONS}
            optionsRole1={ROLE_OPTIONS1}
            onFilterDep={handleFilterDep}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={doctors.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      doctors.map((row) => row._id)
                    )
                  }
                  onSelectAllRows1={(checked) =>
                    onSelectAllRows1(
                      checked,
                      doctors.map((row) => row.account._id)
                    )
                  }
                  actions={
                    <Tooltip title="Xóa bác sĩ">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected, selected1)}>
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
                  rowCount={doctors.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      doctors.map((row) => row._id)
                    )
                  }
                  onSelectAllRows1={(checked) =>
                    onSelectAllRows1(
                      checked,
                      doctors.map((row) => row.account._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <DocTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      selected1={selected1.includes(row.account._id)}
                      onSelectRow={() => onSelectRow(row._id)}
                      onSelectRow1={() => onSelectRow1(row.account._id)}
                      onEditRow={(name) =>
                        handleEditRow(
                          row._id,
                          row.department,
                          row.educationplace,
                          row.workcertificate,
                          row.level,
                          row.degree,
                          row.description,
                          row.excellence,
                          row.workhistory,
                          row.education,
                          name
                        )
                      }
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, doctors.length)} />

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
          </Box>
        </Card>
      </Container>
    </Page>
  ) : (
    <LoadingScreen />
  );
}
