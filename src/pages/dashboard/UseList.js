import { useState, useEffect } from 'react';
import { paramCase } from 'change-case';
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
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { UseTableToolbar, UseTableRow } from '../../sections/@dashboard/user/list';
// ----------------------------------------------------------------------
const ROLE_OPTIONS = ['Tất cả', 'Nam', 'Nữ', 'Không xác định'];

const TABLE_HEAD = [
  { id: 'name', label: 'Người dùng', align: 'left' },
  { id: 'phone', label: 'Số điện thoại', align: 'center' },
  { id: 'gender', label: 'Giới tính', align: 'center' },
];

// ----------------------------------------------------------------------

export default function UseList() {
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

  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      const URL = '/api/admin/user/viewUser';
      try {
        const res = await axios.get(URL);
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUsers();
  }, [users]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Tất cả');

  // const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  function applySortFilter({ users, comparator, filterName, filterRole}) {
    const stabilizedThis = users.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    users = stabilizedThis.map((el) => el[0]);

    if (filterName) {
      users = users.filter(
        (item) =>
          unorm.nfkd(item.account.lname).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1 ||
          unorm.nfkd(item.account.fname).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1 ||
          unorm
            .nfkd(`0${item.account.phone.slice(3)}`)
            .toLowerCase()
            .indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1
      );
    }

    if (filterRole !== 'Tất cả') {
      users = users.filter(
        (item) => 
        unorm
        .nfkd(item.account.gender === 1 && 'Nam' || item.account.gender === 2 && 'Nữ' || item.account.gender === 3 && 'Không xác định')
        .toLowerCase()
        .indexOf(unorm.nfkd(filterRole).toLowerCase()) !== -1 ||    
        unorm
        .nfkd(item.account.gender === 2 && 'Nữ')
        .toLowerCase()
        .indexOf(unorm.nfkd(filterRole).toLowerCase()) !== -1 ||
        unorm
        .nfkd(item.account.gender === 3 && 'Không xác định')
        .toLowerCase()
        .indexOf(unorm.nfkd(filterRole).toLowerCase()) !== -1 
      );
    }

    return users;
  }

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  
  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
    
  };
  

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteRows = async (selected, selected1) => {
    try {
      await axios.post(`/api/admin/user/deleteUser`, {
        data: selected,
        accdata: selected1,
      });
      enqueueSnackbar('Xóa người dùng thành công!');
    } catch (error) {
      console.error(error);
    }
    const deleteRows = users.filter((row) => !selected.includes(row._id) && !selected1.includes(row.account._id));
    setSelected([]);
    setSelected1([]);
    setUsers(deleteRows);
  };

  const dataFiltered = applySortFilter({
    users,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && Boolean(filterName);

  return users !== null ? (
    <Page title="Danh sách người dùng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách người dùng"
          links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Danh sách tài khoản người dùng' }]}
        />

        <Card>
          <Divider />

          <UseTableToolbar
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
                  rowCount={users.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      users.map((row) => row._id)
                    )
                  }
                  onSelectAllRows1={(checked) =>
                    onSelectAllRows1(
                      checked,
                      users.map((row) => row.account._id)
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
                  rowCount={users.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      users.map((row) => row._id)
                    )
                  }
                  onSelectAllRows1={(checked) =>
                    onSelectAllRows1(
                      checked,
                      users.map((row) => row.account._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <UseTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      selected1={selected1.includes(row.account._id)}
                      onSelectRow={() => onSelectRow(row._id)}
                      onSelectRow1={() => onSelectRow1(row.account._id)}
                        
                      
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, users.length)} />

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
