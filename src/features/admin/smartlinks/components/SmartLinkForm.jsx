import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
    TextField, Button, Box, Typography, Paper, Grid, 
    FormControl, InputLabel, Select, MenuItem, FormHelperText, 
    FormControlLabel, Switch 
} from '@mui/material';
// Assuming MUI X Date Pickers are installed: npm install @mui/x-date-pickers
// If not, you might need a different date input solution or install it.
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'; // Use v3 adapter
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { fr } from 'date-fns/locale'; // Import French locale if needed

import { smartLinkSchema } from '../schemas/smartLinkSchema';
import PlatformLinksInput from './PlatformLinksInput';
import TrackingIdsInput from './TrackingIdsInput';
import ImageUpload from '../../artists/components/ImageUpload'; // Re-use ImageUpload from artists feature

// TODO: Replace with actual API calls
// import { createSmartLinkApi, updateSmartLinkApi, getAllArtistsApi } from '../../../../services/api';

// Placeholder API functions
const createSmartLinkApi = async (data) => {
  console.log("Simulating API call to CREATE smartlink:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, data: { ...data, _id: 'newSL123', trackSlug: 'new-track-slug' } };
};
const updateSmartLinkApi = async (id, data) => {
  console.log(`Simulating API call to UPDATE smartlink (${id}):`, data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, data: { ...data, _id: id } };
};
// Placeholder to fetch artists for the dropdown
const getAllArtistsApi = async () => {
    console.log("Simulating API call to GET artists");
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return dummy data
    return {
        success: true,
        data: [
            { _id: 'artist1', name: 'Artist One' },
            { _id: 'artist2', name: 'Artist Two' },
            { _id: 'existing456', name: 'Existing Artist' }, // Match ID from ArtistForm placeholder
        ]
    };
};

const SmartLinkForm = ({ smartLinkData = null, onFormSubmitSuccess }) => {
  const isEditMode = !!smartLinkData;
  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(smartLinkSchema),
    defaultValues: {
      trackTitle: smartLinkData?.trackTitle || '',
      artistId: smartLinkData?.artistId?._id || smartLinkData?.artistId || '', // Handle populated or just ID
      coverImageUrl: smartLinkData?.coverImageUrl || '',
      releaseDate: smartLinkData?.releaseDate ? new Date(smartLinkData.releaseDate) : null,
      description: smartLinkData?.description || '',
      platformLinks: smartLinkData?.platformLinks || [{ platform: '', url: '' }], // Start with one empty link
      trackingIds: smartLinkData?.trackingIds || {},
      isPublished: smartLinkData?.isPublished || false
    }
  });

  // Fetch artists when the component mounts
  useEffect(() => {
    const fetchArtists = async () => {
      setLoadingArtists(true);
      try {
        const response = await getAllArtistsApi();
        if (response.success) {
          setArtists(response.data || []);
        } else {
          console.error("Failed to fetch artists:", response.error);
          setArtists([]); // Set empty on error
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
        setArtists([]);
      } finally {
        setLoadingArtists(false);
      }
    };
    fetchArtists();
  }, []);

  // Callback for ImageUpload component
  const handleImageUploadSuccess = (imageUrl) => {
    setValue('coverImageUrl', imageUrl, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    // Convert date back to ISO string or suitable format if needed by backend
    const submissionData = {
        ...data,
        releaseDate: data.releaseDate ? data.releaseDate.toISOString() : null
    };
    console.log("SmartLink Form Data Submitted:", submissionData);
    try {
      let response;
      if (isEditMode) {
        response = await updateSmartLinkApi(smartLinkData._id, submissionData);
      } else {
        response = await createSmartLinkApi(submissionData);
      }

      if (response.success) {
        console.log("API Success:", response.data);
        if (onFormSubmitSuccess) {
          onFormSubmitSuccess(response.data);
        }
        if (!isEditMode) {
             // Reset form, keeping artist selection might be useful
             const currentArtistId = watch('artistId');
             reset({
                 trackTitle: '',
                 artistId: currentArtistId, // Keep artist selected
                 coverImageUrl: '',
                 releaseDate: null,
                 description: '',
                 platformLinks: [{ platform: '', url: '' }],
                 trackingIds: {},
                 isPublished: false
             }); 
        }
      } else {
        console.error("API Error:", response.error);
        // TODO: Show error to user
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // TODO: Show error to user
    }
  };

  return (
    // <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}> {/* Wrap form if using DatePicker */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Modifier le Smartlink' : 'Créer un Smartlink'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                {...register('trackTitle')}
                label="Titre de la musique"
                required
                fullWidth
                variant="outlined"
                error={!!errors.trackTitle}
                helperText={errors.trackTitle?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required error={!!errors.artistId}>
                <InputLabel id="artist-select-label">Artiste</InputLabel>
                <Controller
                  name="artistId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="artist-select-label"
                      label="Artiste"
                      {...field}
                      disabled={loadingArtists}
                    >
                      <MenuItem value="" disabled><em>{loadingArtists ? 'Chargement...' : 'Sélectionner un artiste'}</em></MenuItem>
                      {artists.map((artist) => (
                        <MenuItem key={artist._id} value={artist._id}>
                          {artist.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.artistId && <FormHelperText>{errors.artistId.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Image Upload for Cover */}
              <ImageUpload 
                  onUploadSuccess={handleImageUploadSuccess} 
                  initialImageUrl={smartLinkData?.coverImageUrl || null}
              />
              <input type="hidden" {...register('coverImageUrl')} />
              {errors.coverImageUrl && (
                  <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {errors.coverImageUrl.message}
                  </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
               {/* Release Date - Using TextField for now, replace with DatePicker if installed */}
               <Controller
                    name="releaseDate"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            label="Date de sortie (AAAA-MM-JJ)"
                            type="date" // Basic HTML5 date input
                            fullWidth
                            variant="outlined"
                            value={field.value ? field.value.toISOString().split('T')[0] : ''} // Format for input type=date
                            onChange={(e) => {
                                // Handle potential invalid date string from input
                                const dateValue = e.target.value ? new Date(e.target.value) : null;
                                field.onChange(dateValue && !isNaN(dateValue) ? dateValue : null);
                            }}
                            error={!!errors.releaseDate}
                            helperText={errors.releaseDate?.message}
                            InputLabelProps={{
                                shrink: true, // Keep label floated
                            }}
                            sx={{ mb: 2 }} // Margin bottom
                        />
                        /* Example using MUI DatePicker (if installed) */
                        /*
                        <DatePicker
                            label="Date de sortie"
                            value={field.value}
                            onChange={(newValue) => field.onChange(newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    error: !!errors.releaseDate,
                                    helperText: errors.releaseDate?.message,
                                    sx: {{ mb: 2 }}
                                },
                            }}
                        />
                        */
                    )}
                />

              <TextField
                {...register('description')}
                label="Description (Optionnel)"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12}>
              {/* Platform Links Input */}
              <PlatformLinksInput control={control} register={register} errors={errors} />
            </Grid>

            <Grid item xs={12}>
              {/* Tracking IDs Input */}
              <TrackingIdsInput register={register} errors={errors} />
            </Grid>

            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Controller
                            name="isPublished"
                            control={control}
                            render={({ field }) => (
                                <Switch {...field} checked={field.value} />
                            )}
                        />
                    }
                    label="Publier ce Smartlink"
                />
                 {errors.isPublished && <FormHelperText error>{errors.isPublished.message}</FormHelperText>}
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || loadingArtists}
              >
                {isSubmitting ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour Smartlink' : 'Créer Smartlink')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    // </LocalizationProvider>
  );
};

export default SmartLinkForm;

