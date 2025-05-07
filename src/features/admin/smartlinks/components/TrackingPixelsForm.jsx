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
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('admin.smartlinks.tracking_pixels')}
      </Typography>

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
    </Box>
  );
};

export default TrackingPixelsForm; 