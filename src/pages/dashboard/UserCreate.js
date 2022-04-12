import { paramCase, capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import unorm from 'unorm';
// @mui
import { Container } from '@mui/material';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewForm from '../../sections/@dashboard/user/UserNewForm';
import DoctorConsultationDetail from '../../sections/@dashboard/user/DoctorConsultationDetail'
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { id } = useParams();

  const [ consultation, setConsultation ] = useState(null);

  const { account } = useAuth();

  async function getConsultation(role) {
    const URL = `/api/${role}/consultation/viewconsult/${id}`;
    try {
      const res = await axios.get(URL);
      setConsultation(res.data);
    } catch (error) {
      console.log(error)
    }
  }
    
  if (unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd("Người dùng").toLowerCase()) !== -1) {
    const role = "user";
    getConsultation(role);
  } else {
    const role = "doctor";
    getConsultation(role);
  }

  return (
    consultation !== null ?
    <Page title="Chi tiết lịch hẹn">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Xem chi tiết lịch hẹn'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.user.account },
            { name: 'Danh sách lịch hẹn', href: (unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd("Người dùng").toLowerCase()) !== -1) ? PATH_DASHBOARD.user.list : PATH_DASHBOARD.user.doctorlist },
            { name: `Lịch hẹn ngày ${format(new Date(consultation[0].date), 'dd/MM/yyyy')} lúc ${consultation[0].hour}` },
          ]}
        />

        { unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd("Người dùng").toLowerCase()) !== -1 ? <UserNewForm consultation={consultation}/> : <DoctorConsultationDetail consultation={consultation}/> }
        
      </Container>
    </Page>
    :
    <LoadingScreen />
  );
}
