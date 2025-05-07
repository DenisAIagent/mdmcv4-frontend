import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  Visibility,
  MusicNote,
  YouTube,
  Spotify,
  Apple,
  Deezer,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { apiService } from '@/services/api.service';

const SmartLinkAnalytics = ({ smartLinkId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });
  const [metrics, setMetrics] = useState({
    totalViews: 0,
    totalClicks: 0,
    platformClicks: {
      spotify: 0,
      deezer: 0,
      apple: 0,
      youtube: 0,
    },
    dailyData: [],
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, [smartLinkId, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiService.smartlinks.getAnalytics(smartLinkId, {
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString(),
      });
      
      if (response.success) {
        setMetrics(response.data);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des analytics');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" color={color}>
          {value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );

  const PlatformMetrics = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Plateforme</TableCell>
            <TableCell align="right">Clics</TableCell>
            <TableCell align="right">% des clics totaux</TableCell>
            <TableCell align="right">Taux de conversion</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(metrics.platformClicks).map(([platform, clicks]) => (
            <TableRow key={platform}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {platform === 'spotify' && <Spotify sx={{ mr: 1, color: '#1DB954' }} />}
                  {platform === 'deezer' && <Deezer sx={{ mr: 1, color: '#00C7F2' }} />}
                  {platform === 'apple' && <Apple sx={{ mr: 1, color: '#FB2D3F' }} />}
                  {platform === 'youtube' && <YouTube sx={{ mr: 1, color: '#FF0000' }} />}
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Box>
              </TableCell>
              <TableCell align="right">{clicks.toLocaleString()}</TableCell>
              <TableCell align="right">
                {((clicks / metrics.totalClicks) * 100).toFixed(1)}%
              </TableCell>
              <TableCell align="right">
                {((clicks / metrics.totalViews) * 100).toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const TrendChart = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('admin.smartlinks.analytics.trends')}
        </Typography>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="views" stroke="#8884d8" name={t('admin.smartlinks.analytics.views')} />
              <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name={t('admin.smartlinks.analytics.clicks')} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {t('admin.smartlinks.analytics.title')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label={t('admin.smartlinks.analytics.start_date')}
                value={dateRange.start}
                onChange={(newValue) => setDateRange(prev => ({ ...prev, start: newValue }))}
              />
              <DatePicker
                label={t('admin.smartlinks.analytics.end_date')}
                value={dateRange.end}
                onChange={(newValue) => setDateRange(prev => ({ ...prev, end: newValue }))}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title={t('admin.smartlinks.analytics.total_views')}
            value={metrics.totalViews}
            icon={<Visibility color="primary" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title={t('admin.smartlinks.analytics.total_clicks')}
            value={metrics.totalClicks}
            icon={<MusicNote color="success" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title={t('admin.smartlinks.analytics.conversion_rate')}
            value={((metrics.totalClicks / metrics.totalViews) * 100).toFixed(1)}
            icon={<TrendingUp color="warning" />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label={t('admin.smartlinks.analytics.platform_metrics')} />
            <Tab label={t('admin.smartlinks.analytics.trends')} />
          </Tabs>
        </Grid>

        <Grid item xs={12}>
          {activeTab === 0 ? <PlatformMetrics /> : <TrendChart />}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmartLinkAnalytics; 