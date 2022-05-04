import React, { useState, useEffect } from 'react';
import unorm from 'unorm';
// @mui
import { Container, Box, Card, Stack, TextField, MenuItem } from '@mui/material';
// redux
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import { ShopProductSearch } from '../../sections/@dashboard/e-commerce/shop';
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
import EmptyContent from '../../components/EmptyContent';
import LoadingScreen from '../../components/LoadingScreen';
// ----------------------------------------------------------------------

export default function UserCards() {
  const { themeStretch } = useSettings();

  const [filterName, setFilterName] = useState('');

  const [filterDepartment, setFilterDepartment] = useState('Tất cả chuyên khoa');

  const DEPARTMENT_OPTIONS = [
    'Tất cả chuyên khoa',
    'chuyên khoa tim mạch',
    'chuyên khoa nội',
    'chuyên khoa ngoại',
    'chuyên khoa thần kinh',
    'chuyên khoa nhãn khoa',
    'chuyên khoa tai mũi họng',
    'chuyên khoa răng-hàm-mặt',
    'chuyên khoa ung bướu',
  ];

  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    async function fetchDoctors() {
      const URL = '/api/home/doctor';
      try {
        const res = await axios.get(URL);
        setDoctors(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDoctors();
  }, [doctors]);

  function handleSortAndSearch({ doctors }) {
    if (filterName) {
      doctors = doctors.filter(
        (item) =>
          unorm.nfkd(item.account.lname).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1 ||
          unorm.nfkd(item.account.fname).toLowerCase().indexOf(unorm.nfkd(filterName).toLowerCase()) !== -1
        // doctor.department.toLowerCase().split('chuyên khoa')[1].trim() === 'nội khoa'
      );
    }

    if (filterDepartment !== 'Tất cả chuyên khoa') {
      doctors = doctors.filter(
        (item) => unorm.nfkd(item.department).toLowerCase().indexOf(unorm.nfkd(filterDepartment).toLowerCase()) !== -1
      );
    }

    return doctors;
  }

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
  };

  const onFilterDepartment = (event) => {
    setFilterDepartment(event.target.value);
  };

  const dataFiltered = handleSortAndSearch({
    doctors,
  });

  const isNotFound = (!dataFiltered.length && filterName) || (!dataFiltered.length && filterDepartment);

  return (
    doctors.length > 0 && (
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

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Stack>
              <ShopProductSearch filterName={filterName} onFilterName={(keyword) => handleFilterName(keyword)} />
            </Stack>

            <Stack>
              <TextField
                fullWidth
                select
                label="Chuyên khoa"
                value={filterDepartment}
                onChange={onFilterDepartment}
                SelectProps={{
                  MenuProps: {
                    sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                  },
                }}
                sx={{
                  maxWidth: { sm: 240 },
                  textTransform: 'capitalize',
                }}
              >
                {DEPARTMENT_OPTIONS.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize',
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>

          {dataFiltered.length === 0 && isNotFound && (
            <EmptyContent
              title="Không tìm thấy bác sĩ"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          )}
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
            {dataFiltered.map((doctor) => (
              <UserCard key={doctor._id} doctor={doctor} />
            ))}
          </Box>
        </Container>
      </Page>
    )
  );
}
