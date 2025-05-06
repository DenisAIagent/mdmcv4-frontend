import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography } from '@mui/material';
import { z } from 'zod';
import { apiService } from '../../../lib/api.service'; // adapte le chemin si besoin
import toast from 'react-toastify';

const artistSchema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  artistImageUrl: z.string().url().optional(),
});

const ArtistEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: '',
      bio: '',
      websiteUrl: '',
      artistImageUrl: '',
    }
  });

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const artist = await apiService.getArtistById(id);
        reset(artist); // remplit les champs avec les données de l'artiste
      } catch (err) {
        toast.error("Impossible de charger l'artiste.");
        navigate('/admin/artists');
      }
    };

    fetchArtist();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      await apiService.updateArtist(id, data);
      toast.success('Artiste mis à jour');
      navigate('/admin/artists');
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Modifier l'artiste</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Nom"
          fullWidth
          margin="normal"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Bio"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          {...register('bio')}
          error={!!errors.bio}
          helperText={errors.bio?.message}
        />
        <TextField
          label="Site Web"
          fullWidth
          margin="normal"
          {...register('websiteUrl')}
          error={!!errors.websiteUrl}
          helperText={errors.websiteUrl?.message}
        />
        <TextField
          label="URL de l'image"
          fullWidth
          margin="normal"
          {...register('artistImageUrl')}
          error={!!errors.artistImageUrl}
          helperText={errors.artistImageUrl?.message}
        />
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Enregistrer
        </Button>
      </form>
    </Box>
  );
};

export default ArtistEditPage;
// src/pages/admin/artists/ArtistEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify'; // Pour les notifications

// Assurez-vous que le chemin est correct
import apiService from '../../../services/api';

// Import MUI Components
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';

// Schéma de validation (identique à la création)
const artistSchema = z.object({
  name: z.string().min(1, { message: "Le nom de l'artiste est requis." }),
  bio: z.string().optional(),
  artistImageUrl: z.string().url({ message: "Veuillez entrer une URL valide pour l'image." }).optional().or(z.literal('')),
});

function ArtistEditPage() {
    const { slugOrId } = useParams(); // Récupère le slug/id depuis l'URL
    const navigate = useNavigate();
    const [artistId, setArtistId] = useState(null); // Pour stocker l'_id interne
    const [loadingData, setLoadingData] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [serverError, setServerError] = useState(null); // Erreur lors de l'update

    const {
        register,
        handleSubmit,
        reset, // Pour pré-remplir le formulaire
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(artistSchema)
    });

    // Effet pour charger les données de l'artiste existant
    useEffect(() => {
        const fetchArtistData = async () => {
            setLoadingData(true);
            setFetchError(null);
            try {
                console.log(`Workspaceing data for artist: ${slugOrId}`);
                // ADAPTEZ à votre méthode apiService réelle
                const response = await apiService.getArtistBySlugOrId(slugOrId);

                if (response.success && response.data) {
                    reset(response.data); // Pré-remplit le formulaire avec les données reçues
                    setArtistId(response.data._id); // Stocke l'ID pour l'update
                    console.log("Artist data loaded and form reset:", response.data);
                } else {
                    setFetchError(response.error || 'Artiste non trouvé ou erreur API.');
                    toast.error(response.error || 'Artiste non trouvé ou erreur API.');
                }
            } catch (err) {
                console.error("Failed to fetch artist data:", err);
                const errorMsg = err.response?.data?.error || err.message || 'Erreur lors du chargement des données.';
                setFetchError(errorMsg);
                toast.error(errorMsg);
            } finally {
                setLoadingData(false);
            }
        };

        if (slugOrId) {
            fetchArtistData();
        } else {
             setFetchError("Identifiant d'artiste manquant dans l'URL.");
             setLoadingData(false);
        }
    }, [slugOrId, reset]); // Dépendances de l'effet

    // Fonction de soumission pour la mise à jour
    const onSubmit = async (data) => {
        if (!artistId) {
            toast.error("Impossible de mettre à jour : ID de l'artiste manquant.");
            return;
        }
        setServerError(null);
        console.log("Données soumises pour mise à jour:", data);
        try {
             // Appel API pour mettre à jour l'artiste
             // ADAPTEZ à votre méthode apiService réelle (besoin de l'ID)
            const response = await apiService.updateArtist(artistId, data);

            if (response.success) {
                toast.success(`Artiste "${data.name}" mis à jour avec succès !`);
                navigate('/admin/artists'); // Redirige vers la liste après succès
            } else {
                const errorMsg = response.error || 'Erreur lors de la mise à jour de l\'artiste.';
                setServerError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            console.error("Erreur API lors de la mise à jour:", err);
            const errorMsg = err.response?.data?.error || err.message || 'Une erreur serveur est survenue.';
            setServerError(errorMsg);
            toast.error(errorMsg);
        }
    };

    // --- Rendu Conditionnel (Chargement/Erreur Initiale) ---
    if (loadingData) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 1 }}>Chargement des données de l'artiste...</Typography>
            </Paper>
        );
    }

    if (fetchError) {
        return <Paper sx={{ p: 3 }}><Alert severity="error">Erreur: {fetchError}</Alert></Paper>;
    }

    // --- Affichage Principal (Formulaire) ---
    return (
        <Paper sx={{ p: 3, maxWidth: '700px', margin: 'auto' }}>
            <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
                Modifier l'Artiste
            </Typography>

            {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Champ Nom */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Nom de l'Artiste"
                    autoFocus
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputLabelProps={{ shrink: true }} // Garde le label en haut si pré-rempli
                />

                {/* Champ Bio */}
                <TextField
                    margin="normal"
                    fullWidth
                    id="bio"
                    label="Biographie (Optionnel)"
                    multiline
                    rows={4}
                    {...register("bio")}
                    error={!!errors.bio}
                    helperText={errors.bio?.message}
                    InputLabelProps={{ shrink: true }}
                />

                {/* Champ URL Image */}
                <TextField
                    margin="normal"
                    fullWidth
                    id="artistImageUrl"
                    label="URL de l'Image Principale (Optionnel)"
                    type="url"
                    {...register("artistImageUrl")}
                    error={!!errors.artistImageUrl}
                    helperText={errors.artistImageUrl?.message}
                    InputLabelProps={{ shrink: true }}
                />

                {/* Bouton de soumission */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <CircularProgress size={24} /> : "Enregistrer les Modifications"}
                </Button>
            </Box>
        </Paper>
    );
}

export default ArtistEditPage;
>>>>>>> 1af81d5 (temp: sauvegarde avant rebase)
