// src/pages/admin/artists/ArtistListPage.jsx (Exemple Complet)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Ajustez le chemin vers votre service api.js
import apiService from '../../../services/api';

// Import MUI Components (assurez-vous que @mui/material et @mui/x-data-grid sont installés)
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Paper,
    IconButton
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
// Optionnel: Importer une lib de notifications comme react-toastify
// import { toast } from 'react-toastify';

function ArtistListPage() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fonction pour récupérer les artistes (peut être appelée pour rafraîchir)
    const fetchArtists = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching artists from API...");
            const response = await apiService.getAllArtists(); // Appel API réel
            console.log("API response for artists:", response);
            if (response.success) {
                // DataGrid préfère un champ 'id'. On le crée à partir de '_id'.
                const artistsWithId = (response.data || []).map(artist => ({ ...artist, id: artist._id }));
                setArtists(artistsWithId);
            } else {
                setError(response.error || 'Erreur inconnue lors du chargement.');
                setArtists([]);
            }
        } catch (err) {
            console.error("Failed to fetch artists:", err);
            const errorMsg = err.response?.data?.error || err.message || 'Erreur serveur';
            setError(errorMsg);
            setArtists([]);
            if (err.response?.status === 401) {
                setError("Erreur d'authentification. Veuillez vous reconnecter.");
                // Optionnel: rediriger vers login
                // setTimeout(() => navigate('/admin/login'), 1500);
            } else if (err.response?.status === 403) {
                 setError("Erreur d'autorisation. Vous n'avez pas les droits nécessaires.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Récupérer les artistes au montage du composant
    useEffect(() => {
        fetchArtists();
    }, []); // Le tableau vide signifie : exécuter une seule fois au montage

    // --- Gestionnaires d'actions ---
    const handleEdit = (slug) => {
        console.log("Edit artist with slug:", slug);
        navigate(`/admin/artists/edit/${slug}`); // Redirige vers la page d'édition
    };

    const handleDelete = async (slug, name) => {
        console.log("Delete artist with slug:", slug);
        // Confirmation utilisateur
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'artiste "${name}" ? Les smartlinks associés pourraient être affectés (selon la logique backend).`)) {
            try {
                // TODO: Ajouter un état de chargement spécifique pour la suppression si besoin
                await apiService.deleteArtist(slug); // Appel API avec le SLUG
                // Utiliser react-toastify ou similaire pour le succès
                // toast.success(`Artiste "${name}" supprimé avec succès.`);
                 console.log(`Artiste "${name}" supprimé avec succès.`);
                // Recharger la liste pour refléter la suppression
                fetchArtists();
            } catch (err) {
                console.error("Failed to delete artist:", err);
                const errorMsg = err.response?.data?.error || err.message || 'Erreur lors de la suppression';
                setError(errorMsg); // Affiche l'erreur en haut du tableau
                 // Utiliser react-toastify ou similaire pour l'erreur
                 // toast.error(`Erreur lors de la suppression: ${errorMsg}`);
            } finally {
               // TODO: Gérer l'état de chargement de la suppression
            }
        }
    };

    // --- Définition des colonnes pour le DataGrid ---
    const columns: GridColDef[] = [
        // Colonne Image (Optionnelle)
         {
           field: 'artistImageUrl',
           headerName: 'Image',
           width: 80,
           renderCell: (params) => (
             params.value ? <img src={params.value} alt={params.row.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} /> : null
           ),
           sortable: false,
           filterable: false,
         },
        { field: 'name', headerName: 'Nom', width: 300, flex: 1 }, // flex: 1 prend l'espace restant
        { field: 'slug', headerName: 'Slug', width: 300, flex: 1 },
        // Vous pouvez ajouter d'autres colonnes ici (ex: date de création)
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 120, // Largeur augmentée pour les icônes
            cellClassName: 'actions',
            getActions: ({ row }) => { // On utilise l'objet 'row' qui contient toutes les données de la ligne
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Modifier"
                        onClick={() => handleEdit(row.slug)} // Utilise le slug de la ligne
                        color="primary" // Couleur pour l'icône d'édition
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Supprimer"
                        onClick={() => handleDelete(row.slug, row.name)} // Utilise le slug et le nom de la ligne
                        color="error" // Couleur pour l'icône de suppression
                    />,
                ];
            },
        },
    ];

    // --- Rendu Conditionnel ---
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Chargement des artistes...</Typography>
            </Box>
        );
    }

    // Affichage principal
    return (
        // Paper ajoute une élévation/un cadre
        <Paper sx={{ p: 2, width: '100%', overflow: 'hidden' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h1">
                    Gestion des Artistes
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/admin/artists/new')} // Redirige vers la page de création
                >
                    Nouvel Artiste
                </Button>
            </Box>

            {/* Conteneur pour le DataGrid avec hauteur définie */}
            <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}> {/* Ajustez la hauteur si besoin */}
                <DataGrid
                    rows={artists} // Les données à afficher
                    columns={columns} // La configuration des colonnes
                    loading={loading} // Affiche un indicateur de chargement intégré
                    pageSizeOptions={[10, 25, 50, 100]} // Choix du nombre d'éléments par page
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 }, // Taille de page par défaut
                         },
                     }}
                    // Fonctionnalités utiles du DataGrid (à activer si besoin)
                    // checkboxSelection
                    // disableRowSelectionOnClick
                />
            </Box>
        </Paper>
    );
}

export default ArtistListPage;
