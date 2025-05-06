import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
    TextField, Button, Box, Typography, Paper, Grid, 
    FormControl, InputLabel, Select, MenuItem, FormHelperText, 
    FormControlLabel, Switch, CircularProgress // Ajout de CircularProgress
} from '@mui/material';
// import { toast } from 'react-toastify'; // Supposons que react-toastify est installé et configuré

import { smartLinkSchema } from '../schemas/smartLinkSchema';
import PlatformLinksInput from './PlatformLinksInput';
import TrackingIdsInput from './TrackingIdsInput';
import ImageUpload from '../../artists/components/ImageUpload';
import apiService from '../../../../services/api.service'; // Utiliser le vrai service API

const SmartLinkForm = ({ smartLinkData = null, onFormSubmitSuccess }) => {
  const isEditMode = !!smartLinkData;
  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [formError, setFormError] = useState(null); // Pour les erreurs générales du formulaire

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
      artistId: smartLinkData?.artistId?._id || smartLinkData?.artistId || '',
      coverImageUrl: smartLinkData?.coverImageUrl || '',
      releaseDate: smartLinkData?.releaseDate ? new Date(smartLinkData.releaseDate) : null,
      description: smartLinkData?.description || '',
      platformLinks: smartLinkData?.platformLinks || [{ platform: '', url: '' }],
      trackingIds: smartLinkData?.trackingIds || {},
      isPublished: smartLinkData?.isPublished || false,
      slug: smartLinkData?.slug || '' // Ajout du champ slug
    }
  });

  useEffect(() => {
    const fetchArtists = async () => {
      setLoadingArtists(true);
      try {
        // Remplacer par l'appel API réel pour les artistes si un service artistService est créé
        // Pour l'instant, on simule ou on suppose que le backend a une route /artists
        // const response = await apiService.artists.getAll(); 
        // Pour cet exemple, on va garder la simulation car artistService n'est pas défini dans api.service.js
        console.log("Simulating API call to GET artists for form");
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockArtists = [
            { _id: 'artist1', name: 'Artist One (Mock)' },
            { _id: 'artist2', name: 'Artist Two (Mock)' },
        ];
        setArtists(mockArtists);
      } catch (error) {
        console.error("Error fetching artists:", error);
        // toast.error("Erreur lors du chargement des artistes.");
        setArtists([]);
      } finally {
        setLoadingArtists(false);
      }
    };
    fetchArtists();
  }, []);

  const handleImageUploadSuccess = (imageUrl) => {
    setValue('coverImageUrl', imageUrl, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setFormError(null);
    const submissionData = {
        ...data,
        releaseDate: data.releaseDate ? data.releaseDate.toISOString().split('T')[0] : null // Format AAAA-MM-JJ
    };
    console.log("SmartLink Form Data Submitted:", submissionData);
    try {
      let response;
      if (isEditMode) {
        response = await apiService.smartlinks.update(smartLinkData._id, submissionData);
      } else {
        response = await apiService.smartlinks.create(submissionData);
      }

      if (response.success) {
        // toast.success(isEditMode ? "SmartLink mis à jour avec succès !" : "SmartLink créé avec succès !");
        console.log("API Success:", response.data);
        if (onFormSubmitSuccess) {
          onFormSubmitSuccess(response.data);
        }
        if (!isEditMode) {
             const currentArtistId = watch('artistId');
             reset({
                 trackTitle: '',
                 artistId: currentArtistId,
                 coverImageUrl: '',
                 releaseDate: null,
                 description: '',
                 platformLinks: [{ platform: '', url: '' }],
                 trackingIds: {},
                 isPublished: false,
                 slug: ''
             }); 
        }
      } else {
        // toast.error(response.error || "Une erreur est survenue.");
        setFormError(response.error || "Une erreur est survenue lors de la soumission.");
        console.error("API Error:", response.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // toast.error(error.message || "Erreur de soumission du formulaire.");
      setFormError(error.message || "Erreur de soumission du formulaire.");
    }
  };

  return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Modifier le Smartlink' : 'Créer un Smartlink'}
        </Typography>
        {formError && <Typography color="error" sx={{ mb: 2 }}>{formError}</Typography>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
              <TextField
                {...register('slug')}
                label="Slug (sera auto-généré si laissé vide)"
                fullWidth
                variant="outlined"
                error={!!errors.slug}
                helperText={errors.slug?.message || "Ex: mon-nouveau-titre. Laisser vide pour auto-génération basée sur le titre."}
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
                      {loadingArtists && <MenuItem value="" disabled><em>Chargement des artistes... <CircularProgress size={20} /></em></MenuItem>}
                      {!loadingArtists && artists.length === 0 && <MenuItem value="" disabled><em>Aucun artiste trouvé.</em></MenuItem>}
                      {!loadingArtists && artists.map((artist) => (
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

            <Grid item xs={12} md={8}>
               <Controller
                    name="releaseDate"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            label="Date de sortie (Optionnel)"
                            type="date"
                            fullWidth
                            variant="outlined"
                            value={field.value ? (typeof field.value === 'string' ? field.value : field.value.toISOString().split('T')[0]) : ''}
                            onChange={(e) => {
                                const dateValue = e.target.value ? new Date(e.target.value + "T00:00:00") : null; // Assurer la date locale
                                field.onChange(dateValue && !isNaN(dateValue) ? dateValue : null);
                            }}
                            error={!!errors.releaseDate}
                            helperText={errors.releaseDate?.message}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                        />
                    )}
                />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <ImageUpload 
                  onUploadSuccess={handleImageUploadSuccess} 
                  initialImageUrl={watch('coverImageUrl') || null}
                  buttonText="Télécharger la pochette"
              />
              <input type="hidden" {...register('coverImageUrl')} />
              {errors.coverImageUrl && (
                  <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {errors.coverImageUrl.message}
                  </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
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
              <PlatformLinksInput control={control} register={register} errors={errors} setValue={setValue} watch={watch} />
            </Grid>

            <Grid item xs={12}>
              <TrackingIdsInput control={control} register={register} errors={errors} />
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
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour Smartlink' : 'Créer Smartlink')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
  );
};

export default SmartLinkForm;

