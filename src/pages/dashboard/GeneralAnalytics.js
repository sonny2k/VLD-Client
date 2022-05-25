import { useState, useEffect } from 'react';
// @mui
import { Grid, Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// utils
import axios from '../../utils/axios';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsTasks,
  AnalyticsNewsUpdate,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  const { themeStretch } = useSettings();

  const [consult, setConsult] = useState([]);

  useEffect(() => {
    async function getConsult() {
      const URL = '/api/admin/consultation/viewlistconsult';
      try {
        const res = await axios.get(URL);
        setConsult(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getConsult();
  }, [consult]);

  const [article, setArticle] = useState([]);
  useEffect(() => {
    async function getArticle() {
      const URL = '/api/admin/article/viewListArticle';
      try {
        const res = await axios.get(URL);
        setArticle(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getArticle();
  }, [article]);

  return (
    consult.length > 0 && (
      <Page title="Thống kê">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Số liệu tổng quan về Văn Lang Doctor
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title="Lịch hẹn chờ xác nhận"
                color="warning"
                total={consult.filter((item) => item.status === 'chờ xác nhận').length}
                icon={'medical-icon:i-waiting-area'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title="Lịch hẹn chờ khám"
                total={consult.filter((item) => item.status === 'chờ khám').length}
                color="info"
                icon={'fa6-solid:house-medical-circle-exclamation'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title="Lịch hẹn bị từ chối"
                total={consult.filter((item) => item.status === 'bị từ chối').length}
                color="error"
                icon={'fa6-solid:house-medical-circle-xmark'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title="Lịch hẹn đã hoàn thành"
                total={consult.filter((item) => item.status === 'đã hoàn thành').length}
                color="success"
                icon={'fa6-solid:house-medical-circle-check'}
              />
            </Grid>

            {/* <Grid item xs={12} md={6} lg={8}>
              <AnalyticsWebsiteVisits />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsCurrentVisits />
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <AnalyticsConversionRates />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsCurrentSubject />
            </Grid> */}

             {article.length > 0 && <Grid item xs={12} md={12} lg={12}>
              <AnalyticsNewsUpdate articles={article}/>
            </Grid> }

            {/* <Grid item xs={12} md={6} lg={4}>
              <AnalyticsOrderTimeline />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsTrafficBySite /> 
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <AnalyticsTasks />
            </Grid> */}
          </Grid>
        </Container>
      </Page>
    )
  );
}
