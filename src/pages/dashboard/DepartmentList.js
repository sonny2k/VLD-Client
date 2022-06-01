import { useState, useEffect } from 'react';
import { paramCase } from 'change-case';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import unorm from 'unorm';
// @mui
import { useTheme } from '@mui/material/styles';
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
import LoadingScreen from '../../components/LoadingScreen';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// utils
import axios from '../../utils/axios';
import { getDepart } from '../../redux/slices/department';

// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { DepartmentTableToolbar, DepartmentTableRow } from '../../sections/@dashboard/user/department';
// ----------------------------------------------------------------------
const ROLE_OPTIONS = ['Tất cả', 'tim mạch', 'nhi'];

const STATUS_OPTIONS = ['Tất cả', 'chờ xác nhận', 'chờ khám', 'đã hủy', 'đã hoàn thành'];

const TABLE_HEAD = [
  { id: 'name', label: 'Chuyên khoa', align: 'center' },
  { id: 'description', label: 'Mô tả', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function DepartmentList() {
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

  const [departments, setDepartments] = useState([]);

  const dispatch = useDispatch();

  const { departs } = useSelector((state) => state.department);

  useEffect(() => {
    dispatch(getDepart());
    setDepartments(departs);
  }, [dispatch, departs]);   
  // useEffect(() => {
  //   async function getDepartments() {
  //     const URL = '/api/admin/department/viewListDepartment';
  //     try {
  //       const res = await axios.get(URL);
  //       setDepartments(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getDepartments();
  // }, []);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Tất cả');

  // const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  function applySortFilter({ departments, comparator, filterName, filterStatus, filterRole }) {
    const stabilizedThis = departments.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    departments = stabilizedThis.map((el) => el[0]);

    if (filterName) {
      departments = departments.filter(
        (item) => unorm.nfkd(item.name).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1
      );
    }
    if (filterRole !== 'Tất cả') {
      departments = departments.filter(
        (item) => unorm.nfkd(item.name).toLowerCase().indexOf(unorm.nfkd(filterRole).toLowerCase()) !== -1
      );
    }

    return departments;
  }

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = departments.filter((row) => row._id !== id);
    setSelected([]);
    setDepartments(deleteRow);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteRows = async (selected) => {
    try {
      await axios.post(`/api/admin/department/deleteDepartment`, {
        data: selected,
      });
      enqueueSnackbar('Xóa chuyên khoa thành công!');
      navigate(PATH_DASHBOARD.user.department);
    } catch (error) {
      console.error(error);
    }
    const deleteRows = departments.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setDepartments(deleteRows);
  };

  const handleEditRow = (_id, name, description) => {
    navigate(PATH_DASHBOARD.user.departmentcreate, {
      state: {
        id1: _id,
        name1: name,
        description1: description,
      },
    });
  };

  const dataFiltered = applySortFilter({
    departments,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && Boolean(filterName);

  return departments !== null ? (
    <Page title="Danh sách chuyên khoa">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách chuyên khoa"
          links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Danh sách chuyên khoa' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.departmentedit}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Thêm chuyên khoa
            </Button>
          }
        />

        <Card>
          <Divider />

          <DepartmentTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={ROLE_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={departments.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      departments.map((row) => row._id)
                    )
                  }
                  actions={
                    <Tooltip title="Xóa chuyên khoa">
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
                  rowCount={departments.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      departments.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <DepartmentTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={(_id, name, description) => handleEditRow(row._id, row.name, row.description)}
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, departments.length)} />

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
