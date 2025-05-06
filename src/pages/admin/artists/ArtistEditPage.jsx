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
