// src/pages/admin/smartlinks/SmartlinkListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Link as MuiLink,
  Tooltip,
  IconButton, // Ajout pour les icônes dans les actions si vous préférez IconButton
} from '@mui/material';
// GridColDef est un type TypeScript, mais nous l'utilisons pour la structure des colonnes.
// En JavaScript pur, on ne déclare pas le type explicitement.
// import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid'; // GridColDef n'est pas utilisé directement dans le code JS pour la déclaration
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';

import apiService from '@/services/api.service'; // Vérifiez le chemin

// Props attendues par ce composant (si vous gérez la navigation en interne comme dans AdminPanel.jsx)
// function SmartlinkListPage({ onNavigateToCreate, onNavigateToEdit }) {
// Si vous utilisez react-router-dom pour la navigation, ces props ne sont pas nécessaires ici.
function SmartlinkListPage() {
  const [smartlinks, setSmartlinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Pour la navigation avec react-router-dom

  const fetchSmartlinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.smartlinks.getAll(); // Utilise la méthode de votre apiService
      
      const smartlinksWithId = (response.data || []).map(sl => ({
        ...sl,
        id: sl._id, // DataGrid a besoin d'un champ 'id' unique pour chaque ligne
        artistName: sl.artistId?.name || 'Artiste inconnu',
        clickCount: sl.clickCount || 0, // Assurer une valeur par défaut
        viewCount: sl.viewCount || 0, // Ajout pour afficher viewCount
        platformClickCount: sl.platformClickCount || 0, // Ajout pour afficher platformClickCount
      }));
      setSmartlinks(smartlinksWithId);
    } catch (err) {
      console.error("Failed to fetch SmartLinks:", err);
      const errorMsg = err.message || err.data?.error || 'Erreur serveur lors du chargement des SmartLinks.';
      setError(errorMsg);
      toast.error(errorMsg);
      setSmartlinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSmartlinks();
  }, [fetchSmartlinks]);

  const handleEdit = (id) => {
    // Si AdminPanel.jsx gère la navigation :
    // if (onNavigateToEdit) onNavigateToEdit(id);
    // Si react-router-dom gère la navigation :
    navigate(`/admin/smartlinks/edit/${id}`);
  };

  const handleCreate = () => {
    // Si AdminPanel.jsx gère la navigation :
    // if (onNavigateToCreate) onNavigateToCreate();
    // Si react-router-dom gère la navigation :
    navigate('/admin/smartlinks/new');
  }

  const handleView = (artistSlug, trackSlug) => {
    if (!artistSlug || !trackSlug) {
      toast.error("Slugs manquants, impossible d'ouvrir le lien.");
      return;
    }
    const publicUrl = `/smartlink/${artistSlug}/${trackSlug}`; // Doit correspondre à votre route publique frontend
    window.open(publicUrl, '_blank');
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le SmartLink "${title}" ? Cette action est irréversible.`)) {
      try {
        setLoading(true);
        await apiService.smartlinks.deleteById(id); // Utilise la méthode de votre apiService
        toast.success(`SmartLink "${title}" supprimé avec succès.`);
        fetchSmartlinks(); // Recharger la liste
      } catch (err) {
        console.error("Failed to delete SmartLink:", err);
        const errorMsg = err.message || err.data?.error || 'Erreur lors de la suppression du SmartLink.';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  // Définition des colonnes pour le DataGrid
  // CORRECTION: Suppression de l'annotation de type TypeScript ': GridColDef[]'
  const columns = [
    {
      field: 'coverImageUrl',
      headerName: 'Pochette',
      width: 80,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt={params.row.trackTitle}
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
          />
        ) : null,
      sortable: false,
      filterable: false,
    },
    { field: 'trackTitle', headerName: 'Titre', width: 250, flex: 1 },
    { field: 'artistName', headerName: 'Artiste', width: 200, flex: 0.8 },
    {
      field: 'isPublished',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Publié' : 'Brouillon'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'viewCount', // Ancien clickCount pour les vues de page
      headerName: 'Vues',
      type: 'number',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'platformClickCount', // Nouveaux clics sur plateforme
      headerName: 'Clics Plateforme',
      type: 'number',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'createdAt',
      headerName: 'Créé le',
      type: 'dateTime', // Type pour le tri et le filtrage
      width: 180,
      valueGetter: (value) => value && new Date(value), // Convertir en objet Date
      renderCell: (params) => params.value && new Date(params.value).toLocaleDateString('fr-FR'), // Formatage localisé
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150, // Augmenté pour 3 icônes
      cellClassName: 'actions',
      getActions: ({ row }) => [
        <Tooltip title="Voir le SmartLink public" key={`view-${row.id}`}>
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="Voir"
            onClick={() => handleView(row.artistId?.slug, row.slug)}
            color="inherit"
            disabled={!row.isPublished || !row.artistId?.slug || !row.slug}
          />
        </Tooltip>,
        <Tooltip title="Modifier" key={`edit-${row.id}`}>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Modifier"
            onClick={() => handleEdit(row.id)}
            color="primary"
          />
        </Tooltip>,
        <Tooltip title="Supprimer" key={`delete-${row.id}`}>
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Supprimer"
            onClick={() => handleDelete(row.id, row.trackTitle)}
            color="error"
          />
        </Tooltip>,
      ],
    },
  ];

  if (loading && smartlinks.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
        <CircularProgress size={50} />
        <Typography sx={{ mt: 2 }} variant="h6">Chargement des SmartLinks...</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
      {error && !loading && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Gestion des SmartLinks
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate} // Utilise la fonction de navigation appropriée
        >
          Nouveau SmartLink
        </Button>
      </Box>

      <Box sx={{ height: 'calc(100vh - 250px)', minHeight: 450, width: '100%' }}> {/* Hauteur ajustée */}
        <DataGrid
          rows={smartlinks}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'createdAt', sort: 'desc' }],
            },
          }}
          density="standard" // ou "compact" ou "comfortable"
          autoHeight={false} // Mettre false pour utiliser la hauteur définie du Box
          // getRowId={(row) => row._id} // Inutile si vous avez déjà un champ 'id'
        />
      </Box>
    </Paper>
  );
}

export default SmartlinkListPage;
