import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import unorm from 'unorm';
import { useSnackbar } from 'notistack';
import { paramCase } from 'change-case';
import { format } from 'date-fns';
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
// utils
import axios from '../../utils/axios';
import { getMedicines } from '../../redux/slices/medicine';
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
import Iconify from '../../components/Iconify';

// sections
import LoadingScreen from '../../components/LoadingScreen';
import { ProductTableToolbar, ProductTableRow } from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------
const ROLE_OPTIONS = ['Tất cả', 'giảm đau', 'đau họng', 'ho', 'viêm họng', 'cảm', 'viêm xoang', 'nhỏ mắt', 'ung bướu', 'thần kinh'];

const TABLE_HEAD = [
  { id: 'tile', label: 'Tên thuốc', align: 'left' },
  { id: 'category', label: 'Loại thuốc', align: 'left' },
  { id: 'specdes', label: 'Quy cách', align: 'left' },
  { id: 'components', label: 'Thành phần thuốc', align: 'left' },
  { id: 'origin', label: 'Nhà sản xuất', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ProductList() {
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

  const navigate = useNavigate();

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);

  const { medicines } = useSelector((state) => state.medicine);

  useEffect(() => {
    dispatch(getMedicines());
    setProducts(medicines);
  }, [dispatch, medicines]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Tất cả');

  // const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  function applySortFilter({ products, comparator, filterName, filterStatus, filterRole }) {
    const stabilizedThis = products.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    products = stabilizedThis.map((el) => el[0]);

    if (filterName) {
      products = products.filter(
        (item) => unorm.nfd(item.title).toLowerCase().indexOf(unorm.nfd(filterName).toLowerCase()) !== -1
      );
    }

    if (filterRole !== 'Tất cả') {
      products = products.filter(
        (item) => unorm.nfd(item.category).toLowerCase().indexOf(unorm.nfd(filterRole).toLowerCase()) !== -1
      );
    }

    return products;
  }

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = products.filter((row) => row._id !== id);
    setSelected([]);
    setProducts(deleteRow);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteRows = async (selected) => {
    try {
      await axios.post(`/api/admin/product/deleteProduct`, {
        data: selected,
      });
      enqueueSnackbar('xóa sản phẩm thành công');
      navigate(PATH_DASHBOARD.user.productlist);
  } catch (error) {
    console.error(error);
  }
    const deleteRows = products.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setProducts(deleteRows);
  };

  const handleEditRow = (_id, title, description, specdes, unit, components, category, origin, image) => {
    navigate(PATH_DASHBOARD.user.productedit, {
      state: {
        id1: _id,
        title1: title,
        description1: description,
        category1: category,
        specdes1: specdes,
        unit1: unit,
        components1: components,
        origin1: origin,
        image1: image,
      },
    });
  };

  const dataFiltered = applySortFilter({
    products,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && Boolean(filterName);

  return products !== null ? (
    <Page title="Quản lý: Danh sách sản phẩm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách sản phẩm"
          links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Danh sách' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.productcreate}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Thêm sản phẩm
            </Button>
          }
        />

        <Card>
          <Divider />

          <ProductTableToolbar
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
                  rowCount={products.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      products.map((row) => row._id)
                    )
                  }
                  actions={
                    <Tooltip title="Xóa sản phẩm">
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
                  rowCount={products.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      products.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <ProductTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={() =>
                        handleEditRow(
                          row._id,
                          row.title,
                          row.description,
                          row.specdes,
                          row.unit,
                          row.components,
                          row.category,
                          row.origin,
                          row.image
                        )
                      }
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, products.length)} />

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
  ) : (
    <LoadingScreen />
  );
}
