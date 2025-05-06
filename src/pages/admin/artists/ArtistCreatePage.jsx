// src/pages/admin/artists/ArtistCreatePage.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Pour les notifications

// Import corrigé avec alias
import apiService from '@/services/api.service';

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

// Schéma de validation avec Zod (incluant websiteUrl comme discuté)
const artistSchema = z.object({
  name: z.string().min(1, { message: "Le nom de l'artiste est requis." }),
  bio: z.string().optional(),
  artistImageUrl: z.string().url({ message: "Veuillez entrer une URL valide pour l'image." }).optional().or(z.literal('')),
  websiteUrl: z.string().url({ message: "Veuillez entrer une URL valide pour le site web." }).optional().or(z.literal('')),
});

function ArtistCreatePage() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null); // Pour les erreurs générales de l'API

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting } // isSubmitting gère l'état de chargement
    } = useForm({
        resolver: zodResolver(artistSchema),
        defaultValues: { // Valeurs par défaut
            name: '',
            bio: '',
            artistImageUrl: '',
            websiteUrl: '', // Ajouté
        }
    });

    const onSubmit = async (data) => {
        setServerError(null); // Réinitialise les erreurs serveur
        console.log("Données soumises pour création:", data);
        try {
            // Utilise la méthode createArtist de api.service.js
            const response = await apiService.createArtist(data);

            if (response.success) {
                toast.success(`Artiste "${data.name}" créé avec succès !`);
                navigate('/admin/artists'); // Redirige vers la liste après succès
            } else {
                const errorMsg = response.error || 'Erreur lors de la création de l\'artiste.';
                setServerError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            console.error("Erreur API lors de la création:", err);
            const errorMsg = err.response?.data?.error || err.message || 'Une erreur serveur est survenue.';
            setServerError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: '700px', margin: 'auto' }}>
            <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
                Créer un Nouvel Artiste
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
                />

                {/* Bouton de soumission */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <CircularProgress size={24} /> : "Créer l'Artiste"}
                </Button>
            </Box>
        </Paper>
    );
}

export default ArtistCreatePage;
