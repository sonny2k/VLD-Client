import React, { useState, useEffect } from 'react';
// @mui
import { Container, Box, Card, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { ProductListToolbar } from '../../sections/@dashboard/e-commerce/product-list';
import { ShopProductSearch, ShopProductSort } from '../../sections/@dashboard/e-commerce/shop';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// utils
import axios from '../../utils/axios';
// components
import SearchNotFound from '../../components/SearchNotFound';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserCard } from '../../sections/@dashboard/user/cards';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------

export default function UserCards() {
  const { themeStretch } = useSettings();

  const [filterName, setFilterName] = useState('');

  const [option, setOption] = useState('');

  const [filteredResults, setFilteredResults] = useState([]);

  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    async function fetchDoctors() {
      const URL = '/api/home/doctor';
      try {
        const res = await axios.get(URL);
        console.log(res.data);
        setDoctors(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDoctors();
  }, []);

  const handleSearch = (searchValue) => {
    setFilterName(searchValue); // input.toLowerCase()
    if (filterName && filterName.length > 1) {
      const filteredData = doctors.filter(
        (doctor) =>
          doctor.account.fname.toLowerCase().includes(filterName) ||
          doctor.account.lname.toLowerCase().includes(filterName)
        // doctor.department.toLowerCase().split('chuyên khoa')[1].trim() === 'nội khoa'
      );
      setFilteredResults(filteredData);
      console.log(filteredData);
    } else {
      setFilteredResults([]);
    }
  };

  const handleSortBy = (value) => {
    setOption.toLowerCase()
    if (option && option.length > 1) {
    const filteredData = doctors.filter (
      (doctor) =>
      doctor.department.toLowerCase().split('chuyên khoa')[1].trim() === ''
    );
    setFilteredResults(filteredData);
      console.log(filteredData);
    } else {
      setFilteredResults([]);
    }
  };

  return (
    <Page title="Danh sách bác sĩ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách bác sĩ"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Cá nhân', href: PATH_DASHBOARD.user.root },
            { name: 'Danh sách bác sĩ' },
          ]}
        />

        <Card>
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <ProductListToolbar 
            filterName={filterName}
            onFilterName={(keyword) => handleSearch(keyword)}
            />
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ShopProductSort />
            
        </Stack>
        </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
            }}
          >
            {filteredResults.length > 0
              ? filteredResults.map((doctor) => <UserCard key={doctor._id} doctor={doctor} />)
              : doctors.map((doctor) => <UserCard key={doctor._id} doctor={doctor} />)}
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
