import React, { useState, useEffect } from "react";
// @mui
import { Container, Box, Card, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import { ShopProductSearch, ShopProductSort } from '../../sections/@dashboard/e-commerce/shop';
// hooks
import useSettings from '../../hooks/useSettings';
// utils
import axios from '../../utils/axios';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import SearchNotFound from '../../components/SearchNotFound';
// sections
import { UserCard } from '../../sections/@dashboard/user/cards';

// ----------------------------------------------------------------------

export default function UserCards() {
  const { themeStretch } = useSettings();

  const [filterName, setFilterName] = useState('');

  const [filteredResults, setFilteredResults] = useState([]);

  const isNotFound = !filteredResults.length && Boolean(filterName);

  const [doctors, setDoctors] = useState([])
  useEffect(() => {
     async function fetchDoctors() {
        const URL = '/api/home/doctor'
        try {
           const res = await axios.get(URL)
           console.log(res.data)
           setDoctors(res.data)
        } catch (error) {
           console.log(error)
        }
     }
     fetchDoctors()
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
    } else {
      setFilteredResults([]);
    }
  };

  const handleSortOptions = (value) => {
    value.toLowerCase();
    if (value) {
      console.log(value);
      const filteredData = doctors.filter((doctor) => doctor.department.toLowerCase().includes(value));
      console.log(filteredData);
      setFilteredResults(filteredData);
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
            <ShopProductSearch filterName={filterName} onFilterName={(keyword) => handleSearch(keyword)} />
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <ShopProductSort sortFunc={handleSortOptions} />
            </Stack>
          </Stack>
          {/* {isNotFound && (
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                )} */}
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
