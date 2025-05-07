// SmartLinkForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify'; // Importation de react-toastify

// Schéma de validation Zod (s'assurer que le chemin est correct)
import { smartLinkSchema } from '../schemas/smartLinkSchema';
// Sous-composants du formulaire (s'assurer que les chemins sont corrects)
import PlatformLinksInput from './PlatformLinksInput';
import TrackingIdsInput from './TrackingIdsInput';
import ImageUpload from '../../artists/components/ImageUpload'; // Peut nécessiter un ajustement de chemin
// Service API (s'assurer que le chemin est correct)
import apiService from '../../../../services/api.service';

const SmartLinkForm = ({ smartLinkData = null, onFormSubmitSuccess }) => {
  const isEditMode = !!smartLinkData;
  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [formError, setFormError] = useState(null); // Pour les erreurs générales non liées à un champ spécifique

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(smartLinkSchema),
    defaultValues: {
      trackTitle: smartLinkData?.trackTitle || '',
      // Assurer que artistId est bien l'ID, que smartLinkData.artistId soit un objet ou une chaîne
      artistId: smartLinkData?.artistId?._id || smartLinkData?.artistId || '',
      coverImageUrl: smartLinkData?.coverImageUrl || '',
      // Gérer la date : convertir en objet Date si elle existe, sinon null.
      // Ajouter "T00:00:00" pour interpréter la date comme locale et éviter les décalages de fuseau.
      releaseDate: smartLinkData?.releaseDate
        ? new Date(`${smartLinkData.releaseDate}T00:00:00`)
        : null,
      description: smartLinkData?.description || '',
      platformLinks: smartLinkData?.platformLinks?.length
        ? smartLinkData.platformLinks
        : [{ platform: '', url: '' }],
      trackingIds: smartLinkData?.trackingIds || {}, // S'assurer que c'est un objet
      isPublished: smartLinkData?.isPublished || false,
      slug: smartLinkData?.slug || '', // Le slug est géré par le backend s'il est vide
    },
  });

  // Effet pour charger les artistes au montage du composant
  useEffect(() => {
    const fetchArtists = async () => {
      setLoadingArtists(true);
      setFormError(null); // Réinitialiser les erreurs précédentes
      try {
        // Appel API réel pour obtenir la liste des artistes
        const response = await apiService.artists.getAllArtists(); // S'assurer que la méthode est correcte
        setArtists(response.data || response || []); // Adapter selon la structure de la réponse API
      } catch (error) {
        console.error('Erreur lors du chargement des artistes:', error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Impossible de charger la liste des artistes.';
        toast.error(errorMessage);
        setFormError(errorMessage); // Afficher l'erreur dans le formulaire
        setArtists([]);
      } finally {
        setLoadingArtists(false);
      }
    };
    fetchArtists();
  }, []); // Tableau de dépendances vide pour exécution unique au montage

  // Callback pour la réussite de l'upload d'image
  const handleImageUploadSuccess = (imageUrl) => {
    setValue('coverImageUrl', imageUrl, { shouldValidate: true, shouldDirty: true });
    toast.info("L'image de couverture a été sélectionnée.");
  };

  // Fonction de soumission du formulaire
  const onSubmit = async (data) => {
    setFormError(null); // Réinitialiser les erreurs générales du formulaire

    const submissionData = {
      ...data,
      // Formater la date en AAAA-MM-JJ pour l'envoi au backend, si elle existe
      releaseDate: data.releaseDate
        ? new Date(data.releaseDate).toISOString().split('T')[0]
        : null,
    };

    console.log('Données du formulaire SmartLink soumises:', submissionData);

    try {
      let responseData;
      if (isEditMode) {
        // Mise à jour d'un SmartLink existant
        responseData = await apiService.smartlinks.update(
          smartLinkData._id,
          submissionData
        );
        toast.success('SmartLink mis à jour avec succès !');
      } else {
        // Création d'un nouveau SmartLink
        responseData = await apiService.smartlinks.create(submissionData);
        toast.success('SmartLink créé avec succès !');
      }

      console.log('Succès API:', responseData);
      if (onFormSubmitSuccess) {
        // Exécuter le callback de succès passé en props (ex: pour rediriger ou rafraîchir la liste)
        onFormSubmitSuccess(responseData.data || responseData); // Adapter selon la structure de la réponse
      }

      // Si c'est une création, réinitialiser le formulaire en conservant l'artiste sélectionné
      if (!isEditMode) {
        const currentArtistId = watch('artistId');
        reset({
          trackTitle: '',
          artistId: currentArtistId, // Conserver l'artiste pour faciliter créations multiples
          coverImageUrl: '',
          releaseDate: null,
          description: '',
          platformLinks: [{ platform: '', url: '' }],
          trackingIds: {},
          isPublished: false,
          slug: '',
        });
      }
    } catch (error) {
      console.error('Erreur de soumission du formulaire:', error);
      const submissionErrorMessage =
        error.response?.data?.message ||
        error.message ||
        'Une erreur est survenue lors de la soumission.';
      toast.error(submissionErrorMessage);
      setFormError(submissionErrorMessage); // Afficher l'erreur dans le formulaire
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mb: 3, fontWeight: 'medium' }}
      >
        {isEditMode ? 'Modifier le SmartLink' : 'Créer un nouveau SmartLink'}
      </Typography>

      {formError && (
        <Typography color="error" sx={{ mb: 2 }} role="alert">
          {formError}
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          {/* Titre de la musique */}
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

          {/* Slug */}
          <Grid item xs={12} md={6}>
            <TextField
              {...register('slug')}
              label="Slug (URL personnalisée)"
              fullWidth
              variant="outlined"
              error={!!errors.slug}
              helperText={
                errors.slug?.message ||
                'Ex: mon-nouveau-single. Laisser vide pour auto-génération.'
              }
            />
          </Grid>

          {/* Sélection de l'Artiste */}
          <Grid item xs={12} md={5}>
            <FormControl fullWidth required error={!!errors.artistId}>
              <InputLabel id="artist-select-label">Artiste</InputLabel>
              <Controller
                name="artistId"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="artist-select-label"
                    label="Artiste *" // Indiquer visuellement les champs requis
                    {...field}
                    disabled={loadingArtists}
                  >
                    {loadingArtists && (
                      <MenuItem value="" disabled>
                        <em>
                          Chargement des artistes...{' '}
                          <CircularProgress
                            size={16}
                            sx={{ verticalAlign: 'middle', ml: 1 }}
                          />
                        </em>
                      </MenuItem>
                    )}
                    {!loadingArtists && artists.length === 0 && (
                      <MenuItem value="" disabled>
                        <em>Aucun artiste trouvé. Veuillez en créer un.</em>
                      </MenuItem>
                    )}
                    {!loadingArtists &&
                      artists.map((artist) => (
                        <MenuItem key={artist._id} value={artist._id}>
                          {artist.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              {errors.artistId && (
                <FormHelperText>{errors.artistId.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Date de sortie */}
          <Grid item xs={12} md={7}>
            <Controller
              name="releaseDate"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Date de sortie (Optionnel)"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => {
                    const dateValue = e.target.value
                      ? new Date(`${e.target.value}T00:00:00`) // Assurer interprétation locale
                      : null;
                    field.onChange(
                      dateValue && !isNaN(dateValue.getTime()) ? dateValue : null
                    );
                  }}
                  error={!!errors.releaseDate}
                  helperText={errors.releaseDate?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Upload de l'image de couverture */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
              Image de couverture
            </Typography>
            <ImageUpload
              onUploadSuccess={handleImageUploadSuccess}
              initialImageUrl={watch('coverImageUrl') || null}
              buttonText="Télécharger la pochette"
              // S'assurer que ImageUpload gère l'affichage de l'erreur si nécessaire
            />
            {/* L'URL est stockée via setValue, mais l'input hidden peut rester pour debug ou cas spécifiques */}
            <input type="hidden" {...register('coverImageUrl')} />
            {errors.coverImageUrl && (
              <FormHelperText error sx={{ mt: 1 }}>
                {errors.coverImageUrl.message}
              </FormHelperText>
            )}
          </Grid>

          {/* Description */}
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

          {/* Liens des plateformes */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>
              Liens des plateformes
            </Typography>
            <PlatformLinksInput
              control={control}
              register={register}
              errors={errors}
              setValue={setValue} // Nécessaire si PlatformLinksInput modifie des valeurs
              watch={watch}       // Nécessaire si PlatformLinksInput observe des valeurs
            />
          </Grid>

          {/* Pixels de Tracking */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>
              Pixels de Tracking (Optionnel)
            </Typography>
            <TrackingIdsInput
              control={control}
              register={register}
              errors={errors} // Passer les erreurs pour affichage dans le sous-composant
            />
          </Grid>

          {/* Publier le Smartlink */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="isPublished"
                  control={control}
                  render={({ field }) => (
                    <Switch {...field} checked={field.value} color="primary" />
                  )}
                />
              }
              label="Publier ce SmartLink (le rendre accessible publiquement)"
            />
            {errors.isPublished && (
              <FormHelperText error>
                {errors.isPublished.message}
              </FormHelperText>
            )}
          </Grid>

          {/* Bouton de soumission */}
          <Grid
            item
            xs={12}
            sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || loadingArtists}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              sx={{ minWidth: { xs: '100%', sm: 180 }, py: 1.5 }}
            >
              {isSubmitting
                ? 'Enregistrement...'
                : isEditMode
                ? 'Mettre à jour'
                : 'Créer SmartLink'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SmartLinkForm;
