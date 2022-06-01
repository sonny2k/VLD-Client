import { useState, useEffect } from 'react';
import { paramCase } from 'change-case';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import unorm from 'unorm';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Tab,
  Tabs,
  Grid,
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
import { getArticlecate } from '../../redux/slices/articlecate';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { CategoryArticleTableToolbar, CategoryArticleTableRow } from '../../sections/@dashboard/user/list';
// ----------------------------------------------------------------------
const ROLE_OPTIONS = ['Tất cả', 'Đã đăng', 'Chưa đăng'];

const STATUS_OPTIONS = ['Tất cả', 'chờ xác nhận', 'chờ khám', 'đã hủy', 'đã hoàn thành'];

const TABLE_HEAD = [{ id: 'name', label: 'Tên danh mục', align: 'left' }, { id: '' }];

// ----------------------------------------------------------------------

export default function CategoryArticleList() {
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

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();

  const { artcates } = useSelector((state) => state.articlecate);

  useEffect(() => {
    dispatch(getArticlecate());
    setCategories(artcates);
  }, [dispatch, artcates]);   
  // useEffect(() => {
  //   async function getCategory() {
  //     const URL = '/api/admin/article/viewArticleCategory';
  //     try {
  //       const res = await axios.get(URL);
  //       setCategories(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getCategory();
  // }, []);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Tất cả');

  // const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  function applySortFilter({ categories, comparator, filterName, filterStatus, filterRole }) {
    const stabilizedThis = categories.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    categories = stabilizedThis.map((el) => el[0]);

    if (filterName) {
      categories = categories.filter(
        (item) => unorm.nfkd(item.name).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1
      );
    }

    if (filterRole !== 'Tất cả') {
      categories = categories.filter(
        (item) => unorm.nfkd(item.status).toLowerCase().indexOf(unorm.nfkd(filterRole).toLowerCase()) !== -1
      );
    }

    return categories;
  }

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = categories.filter((row) => row._id !== id);
    setSelected([]);
    setCategories(deleteRow);
  };

  const handleDeleteRows = async (selected) => {
    try {
      await axios.post(`/api/admin/article/deleteArticleCategory`, {
        data: selected,
      });
      enqueueSnackbar('Xóa danh mục thành công!');
      navigate(PATH_DASHBOARD.user.categoryarticlelist);
    } catch (error) {
      console.error(error);
    }
    const deleteRows = categories.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setCategories(deleteRows);
  };

  const handleEditRow = (_id, name) => {
    navigate(PATH_DASHBOARD.user.categoryarticlecreate, {
      state: {
        id1: _id,
        name1: name,
      },
    });
  };

  const dataFiltered = applySortFilter({
    categories,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && Boolean(filterName);

  return (
    categories !== null && (
      <Page title="Danh sách danh mục tin tức">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Danh sách danh mục "
            links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Danh sách danh mục tin tức' }]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.user.categoryarticleedit}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                Thêm Danh Mục
              </Button>
            }
          />
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Card sx={{ width: 600, position: 'relative' }}>
              <Divider />

              <CategoryArticleTableToolbar
                filterName={filterName}
                filterRole={filterRole}
                onFilterName={handleFilterName}
                onFilterRole={handleFilterRole}
                optionsRole={ROLE_OPTIONS}
              />

              <Scrollbar>
                <TableContainer>
                  {selected.length > 0 && (
                    <TableSelectedActions
                      dense={dense}
                      numSelected={selected.length}
                      rowCount={categories.length}
                      onSelectAllRows={(checked) =>
                        onSelectAllRows(
                          checked,
                          categories.map((row) => row._id)
                        )
                      }
                      actions={
                        <Tooltip title="Xóa danh mục">
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
                      rowCount={categories.length}
                      numSelected={selected.length}
                      onSort={onSort}
                      onSelectAllRows={(checked) =>
                        onSelectAllRows(
                          checked,
                          categories.map((row) => row._id)
                        )
                      }
                    />

                    <TableBody>
                      {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <CategoryArticleTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onEditRow={() => handleEditRow(row._id, row.name)}
                        />
                      ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(page, rowsPerPage, categories.length)}
                      />

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
          </Grid>
        </Container>
      </Page>
    )
  );
}
