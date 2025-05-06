// src/pages/admin/artists/ArtistEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify'; // Pour les notifications

// Vérifiez si ce chemin vers apiService est correct pour vous
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

// Schéma de validation (MAJ: ajout de websiteUrl)
const artistSchema = z.object({
  name: z.string().min(1, { message: "Le nom de l'artiste est requis." }),
  bio: z.string().optional(),
  artistImageUrl: z.string().url({ message: "Veuillez entrer une URL valide pour l'image." }).optional().or(z.literal('')),
  websiteUrl: z.string().url({ message: "Veuillez entrer une URL valide pour le site web." }).optional().or(z.literal('')), // Ajouté
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
        // Les defaultValues seront définis par reset après le fetch
    });

    // Effet pour charger les données de l'artiste existant
    useEffect(() => {
        const fetchArtistData = async () => {
            setLoadingData(true);
            setFetchError(null);
            try {
                console.log(`Workspaceing data for artist: ${slugOrId}`);
                // --- ADAPTEZ CET APPEL API ---
                const response = await apiService.getArtistBySlugOrId(slugOrId); // Fonction à vérifier/adapter

                if (response.success && response.data) {
                    // Pré-remplit le formulaire avec les données reçues
                    // Assurez-vous que les noms de champs correspondent entre response.data et le schéma Zod
                    reset({
                        name: response.data.name || '',
                        bio: response.data.bio || '',
                        artistImageUrl: response.data.artistImageUrl || '',
                        websiteUrl: response.data.websiteUrl || '' // Ajouté
                    });
                    setArtistId(response.data._id); // Stocke l'ID interne pour l'update
                    console.log("Artist data loaded and form reset:", response.data);
                } else {
                    const errorMsg = response.error || 'Artiste non trouvé ou erreur API.';
                    setFetchError(errorMsg);
                    toast.error(errorMsg);
                    // Optionnel: rediriger si l'artiste n'est pas trouvé
                    // navigate('/admin/artists');
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
    }, [slugOrId, reset, navigate]); // Dépendances de l'effet

    // Fonction de soumission pour la mise à jour
    const onSubmit = async (data) => {
        if (!artistId) {
            toast.error("Impossible de mettre à jour : ID de l'artiste manquant.");
            return;
        }
        setServerError(null);
        console.log("Données soumises pour mise à jour:", data);
        try {
             // --- ADAPTEZ CET APPEL API ---
             // Assurez-vous que updateArtist attend l'ID et les données
            const response = await apiService.updateArtist(artistId, data); // Fonction à vérifier/adapter

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
                 {/* Optionnel: afficher le nom chargé */}
                 {/* {getValues("name") ? `: ${getValues("name")}` : ''} */}
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

                 {/* Champ Site Web */}
                 <TextField
                    margin="normal"
                    fullWidth
                    id="websiteUrl"
                    label="Site Web (Optionnel)"
                    type="url"
                    {...register("websiteUrl")}
                    error={!!errors.websiteUrl}
                    helperText={errors.websiteUrl?.message}
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
                    disabled={isSubmitting || loadingData} // Désactivé si chargement initial ou soumission
                >
                    {isSubmitting ? <CircularProgress size={24} /> : "Enregistrer les Modifications"}
                </Button>
            </Box>
        </Paper>
    );
}

export default ArtistEditPage;
