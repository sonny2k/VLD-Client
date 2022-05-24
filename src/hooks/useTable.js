import { useState } from 'react';

// ----------------------------------------------------------------------

export default function useTable(props) {
  const [dense, setDense] = useState(props?.defaultDense || false);

  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');

  const [order, setOrder] = useState(props?.defaultOrder || 'asc');

  const [page, setPage] = useState(props?.defaultCurrentPage || 0);

  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 5);

  const [selected, setSelected] = useState(props?.defaultSelected || []);

  const [selected1, setSelected1] = useState(props?.defaultSelected || []);

  const onSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const onSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const onSelectRow1 = (id) => {
    const selectedIndex1 = selected1.indexOf(id);

    let newSelected1 = [];

    if (selectedIndex1 === -1) {
      newSelected1 = newSelected1.concat(selected1, id);
    } else if (selectedIndex1 === 0) {
      newSelected1 = newSelected1.concat(selected1.slice(1));
    } else if (selectedIndex1 === selected1.length - 1) {
      newSelected1 = newSelected1.concat(selected1.slice(0, -1));
    } else if (selectedIndex1 > 0) {
      newSelected1 = newSelected1.concat(selected1.slice(0, selectedIndex1), selected1.slice(selectedIndex1 + 1));
    }
    setSelected1(newSelected1);
  };

  const onSelectAllRows = (checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const onSelectAllRows1 = (checked, newSelecteds1) => {
    if (checked) {
      setSelected1(newSelecteds1);
      return;
    }
    setSelected1([]);
  };

  const onChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const onChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // filter

  return {
    dense,
    order,
    page,
    setPage,
    orderBy,
    rowsPerPage,
    //
    selected,
    setSelected,
    selected1,
    setSelected1,
    onSelectRow,
    onSelectAllRows,
    onSelectRow1,
    onSelectAllRows1,
    //
    onSort,
    onChangePage,
    onChangeDense,
    onChangeRowsPerPage,
  };
}

// ----------------------------------------------------------------------

export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
