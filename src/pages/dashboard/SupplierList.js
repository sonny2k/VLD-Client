import { useState, useEffect } from 'react';
import { paramCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import unorm from 'unorm';
import { useSnackbar } from 'notistack';
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
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { SupplierTableToolbar, SupplierTableRow } from '../../sections/@dashboard/user/list';
// ----------------------------------------------------------------------
const ROLE_OPTIONS = ['Tất cả', 'Đã đăng', 'Chưa đăng'];

const STATUS_OPTIONS = ['Tất cả', 'chờ xác nhận', 'chờ khám', 'đã hủy', 'đã hoàn thành'];

const TABLE_HEAD = [
  { id: 'name', label: 'Tên nhà cung cấp', align: 'left' },
  { id: 'description', label: 'Mô tả', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function SupplierList() {
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

  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    async function getSupplier() {
      const URL = '/api/admin/supplier/viewSupplier';
      try {
        const res = await axios.get(URL);
        setSuppliers(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getSupplier();
  }, []);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Tất cả');

  // const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  function applySortFilter({ suppliers, comparator, filterName, filterStatus, filterRole }) {
    const stabilizedThis = suppliers.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    suppliers = stabilizedThis.map((el) => el[0]);

    if (filterName) {
      suppliers = suppliers.filter(
        (item) => unorm.nfkd(item.name).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1
      );
    }

    if (filterRole !== 'Tất cả') {
      suppliers = suppliers.filter(
        (item) => unorm.nfkd(item.status).toLowerCase().indexOf(unorm.nfkd(filterRole).toLowerCase()) !== -1
      );
    }

    return suppliers;
  }

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = suppliers.filter((row) => row._id !== id);
    setSelected([]);
    setSuppliers(deleteRow);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteRows = async (selected) => {
    try {
      await axios.post(`/api/admin/supplier/deleteSupplier`, {
        data: selected,
      });
      enqueueSnackbar('Xóa nhà cung cấp thành công!');
      navigate(PATH_DASHBOARD.user.supplierlist);
    } catch (error) {
      console.error(error);
    }
    const deleteRows = suppliers.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setSuppliers(deleteRows);
  };

  const handleEditRow = (_id, name, description) => {
    navigate(PATH_DASHBOARD.user.suppliercreate, {
      state: {
        id1: _id,
        name1: name,
        description1: description,
      },
    });
  };

  const dataFiltered = applySortFilter({
    suppliers,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && Boolean(filterName);

  return (
    suppliers !== null && (
      <Page title="Danh sách nhà cung cấp">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Danh sách nhà cung cấp"
            links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Danh sách nhà cung cấp' }]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.user.supplieredit}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                Thêm nhà cung cấp
              </Button>
            }
          />

          <Card>
            <Divider />

            <SupplierTableToolbar
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
                    rowCount={suppliers.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        suppliers.map((row) => row._id)
                      )
                    }
                    actions={
                      <Tooltip title="Xóa nhà cung cấp">
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
                    rowCount={suppliers.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        suppliers.map((row) => row._id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <SupplierTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id, row.name, row.description)}
                      />
                    ))}

                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, suppliers.length)} />

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
    )
  );
}
