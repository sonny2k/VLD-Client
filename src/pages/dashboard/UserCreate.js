import { paramCase, capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
// @mui
import { Container } from '@mui/material';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewForm from '../../sections/@dashboard/user/UserNewForm';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { id } = useParams();

  const [ consultation, setConsultation ] = useState();

  useEffect(() => {
    async function getConsultation() {
      const URL = `/api/user/consultation/viewconsult/${id}`;
      try {
        const res = await axios.get(URL);
        setConsultation(res.data);
      } catch (error) {
        console.log(error)
      }
    }
    getConsultation();
  }, [id])

  return (
    consultation ?
    <Page title="Chi tiết lịch hẹn">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Xem chi tiết lịch hẹn'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.user.account },
            { name: 'Danh sách lịch hẹn', href: PATH_DASHBOARD.user.list },
            { name: `Lịch hẹn ngày ${format(new Date(consultation[0].date), 'dd/MM/yyyy')} lúc ${consultation[0].hour}` },
          ]}
        />

        <UserNewForm consultation={consultation}/>
      </Container>
    </Page>
    :
    <LoadingScreen />
  );
}
