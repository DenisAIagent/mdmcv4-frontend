import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FacebookIcon from '@mui/icons-material/Facebook';
import TikTokIcon from '@mui/icons-material/VideoLibrary';

const TrackingPixelsForm = ({ formData, setFormData }) => {
  const { t } = useTranslation();

  const handlePixelChange = (platform, field, value) => {
    setFormData(prev => ({
      ...prev,
      trackingPixels: {
        ...prev.trackingPixels,
        [platform]: {
          ...prev.trackingPixels[platform],
          [field]: value
        }
      }
    }));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Configuration des Pixels de Tracking
      </Typography>
      
      <Grid container spacing={3}>
        {/* Google Analytics 4 */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ID GA4 de l'artiste"
            name="trackingIds.ga4.artistId"
            value={formData.trackingIds?.ga4?.artistId || ''}
            onChange={(e) => handlePixelChange('ga4', 'artistId', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="ID Propriété GA4 du single"
            name="trackingIds.ga4.propertyId"
            value={formData.trackingIds?.ga4?.propertyId || ''}
            onChange={(e) => handlePixelChange('ga4', 'propertyId', e.target.value)}
            margin="normal"
          />
        </Grid>

        {/* Google Tag Manager */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ID GTM de l'artiste"
            name="trackingIds.gtm.artistId"
            value={formData.trackingIds?.gtm?.artistId || ''}
            onChange={(e) => handlePixelChange('gtm', 'artistId', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="ID Conteneur GTM du single"
            name="trackingIds.gtm.containerId"
            value={formData.trackingIds?.gtm?.containerId || ''}
            onChange={(e) => handlePixelChange('gtm', 'containerId', e.target.value)}
            margin="normal"
          />
        </Grid>

        {/* Google Ads */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ID Conversion Google Ads de l'artiste"
            name="trackingIds.googleAds.artistId"
            value={formData.trackingIds?.googleAds?.artistId || ''}
            onChange={(e) => handlePixelChange('googleAds', 'artistId', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="ID Conversion Google Ads du single"
            name="trackingIds.googleAds.conversionId"
            value={formData.trackingIds?.googleAds?.conversionId || ''}
            onChange={(e) => handlePixelChange('googleAds', 'conversionId', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Label de conversion Google Ads"
            name="trackingIds.googleAds.label"
            value={formData.trackingIds?.googleAds?.label || ''}
            onChange={(e) => handlePixelChange('googleAds', 'label', e.target.value)}
            margin="normal"
          />
        </Grid>

        {/* Meta Pixel */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ID Meta Pixel de l'artiste"
            name="trackingIds.meta.artistId"
            value={formData.trackingIds?.meta?.artistId || ''}
            onChange={(e) => handlePixelChange('meta', 'artistId', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="ID Meta Pixel du single"
            name="trackingIds.meta.pixelId"
            value={formData.trackingIds?.meta?.pixelId || ''}
            onChange={(e) => handlePixelChange('meta', 'pixelId', e.target.value)}
            margin="normal"
          />
        </Grid>

        {/* TikTok Pixel */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ID TikTok Pixel de l'artiste"
            name="trackingIds.tiktok.artistId"
            value={formData.trackingIds?.tiktok?.artistId || ''}
            onChange={(e) => handlePixelChange('tiktok', 'artistId', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="ID TikTok Pixel du single"
            name="trackingIds.tiktok.pixelId"
            value={formData.trackingIds?.tiktok?.pixelId || ''}
            onChange={(e) => handlePixelChange('tiktok', 'pixelId', e.target.value)}
            margin="normal"
          />
        </Grid>
      </Grid>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AnalyticsIcon />
            <Typography>Google Analytics 4 & GTM</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Switch
                checked={formData.trackingPixels?.ga4?.enabled || false}
                onChange={(e) => handlePixelChange('ga4', 'enabled', e.target.checked)}
              />
            }
            label={t('admin.smartlinks.enable_ga4')}
          />
          {formData.trackingPixels?.ga4?.enabled && (
            <TextField
              fullWidth
              margin="normal"
              label={t('admin.smartlinks.ga4_measurement_id')}
              value={formData.trackingPixels?.ga4?.measurementId || ''}
              onChange={(e) => handlePixelChange('ga4', 'measurementId', e.target.value)}
              helperText={t('admin.smartlinks.ga4_measurement_id_help')}
            />
          )}
          <FormControlLabel
            control={
              <Switch
                checked={formData.trackingPixels?.gtm?.enabled || false}
                onChange={(e) => handlePixelChange('gtm', 'enabled', e.target.checked)}
              />
            }
            label={t('admin.smartlinks.enable_gtm')}
          />
          {formData.trackingPixels?.gtm?.enabled && (
            <TextField
              fullWidth
              margin="normal"
              label={t('admin.smartlinks.gtm_container_id')}
              value={formData.trackingPixels?.gtm?.containerId || ''}
              onChange={(e) => handlePixelChange('gtm', 'containerId', e.target.value)}
              helperText={t('admin.smartlinks.gtm_container_id_help')}
            />
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FacebookIcon />
            <Typography>Meta Pixel</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Switch
                checked={formData.trackingPixels?.meta?.enabled || false}
                onChange={(e) => handlePixelChange('meta', 'enabled', e.target.checked)}
              />
            }
            label={t('admin.smartlinks.enable_meta_pixel')}
          />
          {formData.trackingPixels?.meta?.enabled && (
            <TextField
              fullWidth
              margin="normal"
              label={t('admin.smartlinks.meta_pixel_id')}
              value={formData.trackingPixels?.meta?.pixelId || ''}
              onChange={(e) => handlePixelChange('meta', 'pixelId', e.target.value)}
              helperText={t('admin.smartlinks.meta_pixel_id_help')}
            />
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TikTokIcon />
            <Typography>TikTok Pixel</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Switch
                checked={formData.trackingPixels?.tiktok?.enabled || false}
                onChange={(e) => handlePixelChange('tiktok', 'enabled', e.target.checked)}
              />
            }
            label={t('admin.smartlinks.enable_tiktok_pixel')}
          />
          {formData.trackingPixels?.tiktok?.enabled && (
            <TextField
              fullWidth
              margin="normal"
              label={t('admin.smartlinks.tiktok_pixel_id')}
              value={formData.trackingPixels?.tiktok?.pixelId || ''}
              onChange={(e) => handlePixelChange('tiktok', 'pixelId', e.target.value)}
              helperText={t('admin.smartlinks.tiktok_pixel_id_help')}
            />
          )}
        </AccordionDetails>
      </Accordion>

      <Alert severity="info" sx={{ mt: 2 }}>
        {t('admin.smartlinks.tracking_pixels_info')}
      </Alert>
    </Paper>
  );
};

export default TrackingPixelsForm; 