import React, { useState, useEffect } from "react";
// @mui
import { Container, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// utils
import axios from '../../utils/axios';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserCard } from '../../sections/@dashboard/user/cards';

// ----------------------------------------------------------------------

export default function UserCards() {
  const { themeStretch } = useSettings();

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
  }, [])

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
          {doctors.map((doctor) => (
            <UserCard key={doctor._id} doctor={doctor} />
          ))}
        </Box>
      </Container>
    </Page>
  );
}
