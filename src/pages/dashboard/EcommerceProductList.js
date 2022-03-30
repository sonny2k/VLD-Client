import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
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
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { ProductTableToolbar, ProductTableRow } from '../../sections/@dashboard/e-commerce/product-list';

// ----------------------------------------------------------------------
const ROLE_OPTIONS = ['Tất cả', 'thuốc ho', 'thuốc đau bụng'];

const STATUS_OPTIONS = ['Tất cả', 'chờ xác nhận', 'chờ khám', 'đã hủy', 'đã hoàn thành'];

const TABLE_HEAD = [
  { id: 'name', label: 'Sản phẩm', align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', align: 'center' },
  { id: 'categories', label: 'Loại', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceProductList() {
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

  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function getProducts() {
      const URL = '/api/admin/product/viewProduct';
      try {
        const res = await axios.get(URL);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getProducts();
  }, []);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Tất cả');

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
        (item) =>
          unorm.nfd(item.title).toLowerCase().indexOf(unorm.nfd(filterName).toLowerCase()) !== -1
      );
    }
    if (filterRole !== 'Tất cả') {
      products = products.filter(
        (item) => unorm.nfd(item.products).toLowerCase().indexOf(unorm.nfd(filterRole).toLowerCase()) !== -1
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

  const handleDeleteRows = (selected) => {
    const deleteRows = products.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setProducts(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(`${PATH_DASHBOARD.user.root}/detail/${paramCase(id)}`);
  };

  const dataFiltered = applySortFilter({
    products,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && Boolean(filterName);

  return products !== null ? (
    <Page title="Ecommerce: Product List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách thuốc"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Danh sách thuốc' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.eCommerce.newProduct}
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
                      onEditRow={() => handleEditRow(row._id)}
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
