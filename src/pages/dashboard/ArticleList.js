import { useState, useEffect } from 'react';
import { paramCase } from 'change-case';
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
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { ArticleTableToolbar, ArticleTableRow } from '../../sections/@dashboard/user/list';
// ----------------------------------------------------------------------
const ROLE_OPTIONS = ['Tất cả', 'Đã đăng', 'Chưa đăng'];

const STATUS_OPTIONS = ['Tất cả', 'chờ xác nhận', 'chờ khám', 'đã hủy', 'đã hoàn thành'];

const TABLE_HEAD = [
  { id: 'title', label: 'Tiêu đề', align: 'left' },
  { id: 'author', label: 'Tác giả', align: 'center' },
  { id: 'articlecategory', label: 'Loại', align: 'center' },
  { id: 'status', label: 'Trạng thái', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ArticleList() {
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

  const [articles, setArticles] = useState([]);
  useEffect(() => {
    async function getArticle() {
      const URL = '/api/admin/article/viewListArticle';
      try {
        const res = await axios.get(URL);
        setArticles(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getArticle();
  }, []);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('Tất cả');

  // const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  function applySortFilter({ articles, comparator, filterName, filterStatus, filterRole }) {
    const stabilizedThis = articles.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    articles = stabilizedThis.map((el) => el[0]);

    if (filterName) {
      articles = articles.filter(
        (item) =>
          unorm.nfd(item.title).toLowerCase().indexOf(unorm.nfd(filterName).toLowerCase()) !== -1 ||
          unorm.nfd(item.author).toLowerCase().indexOf(unorm.nfd(filterName).toLowerCase()) !== -1
      );
    }

    if (filterRole !== 'Tất cả') {
      articles = articles.filter(
        (item) => unorm.nfd(item.status === 0 ? 'Chưa đăng' : 'Đã đăng').toLowerCase().indexOf(unorm.nfd(filterRole).toLowerCase()) !== -1
      );
    }

    return articles;
  }

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = articles.filter((row) => row._id !== id);
    setSelected([]);
    setArticles(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = articles.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setArticles(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(`${PATH_DASHBOARD.user.root}/detail/${paramCase(id)}`);
  };

  const dataFiltered = applySortFilter({
    articles,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && Boolean(filterName);

  return (
    articles !== null && (
      <Page title="Danh sách tin tức">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Danh sách tin tức"
            links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Danh sách tin tức' }]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.blog.new}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                Thêm tin tức
              </Button>
            }
          />

          <Card>
            <Divider />

            <ArticleTableToolbar
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
                    rowCount={articles.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        articles.map((row) => row._id)
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
                    rowCount={articles.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        articles.map((row) => row._id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <ArticleTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, articles.length)} />

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
    )
  );
}
