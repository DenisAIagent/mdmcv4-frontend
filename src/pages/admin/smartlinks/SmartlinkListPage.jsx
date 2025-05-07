// src/pages/admin/smartlinks/SmartlinkListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
// PAS DE useNavigate ici, la navigation est gérée par AdminPanel via les props
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';

// Assurez-vous que cet alias est bien configuré dans votre vite.config.js
// et que api.service.js exporte bien un objet avec une propriété 'smartlinks'
import apiService from '@/services/api.service';

// Ce composant reçoit maintenant des fonctions de callback pour la navigation
function SmartlinkListPage({ onNavigateToCreate, onNavigateToEdit }) {
  const [smartlinks, setSmartlinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSmartlinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assurez-vous que apiService.smartlinks.getAll existe et fonctionne
      const response = await apiService.smartlinks.getAll();
      
      const smartlinksWithId = (response.data || []).map(sl => ({
        ...sl,
        id: sl._id, // DataGrid a besoin d'un champ 'id'
        artistName: sl.artistId?.name || 'Artiste inconnu',
        viewCount: sl.viewCount || 0,
        platformClickCount: sl.platformClickCount || 0,
      }));
      setSmartlinks(smartlinksWithId);
    } catch (err) {
      console.error("SmartlinkListPage - Failed to fetch SmartLinks:", err);
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

  const handleEditClick = (id) => {
    if (onNavigateToEdit) {
      onNavigateToEdit(id); // Appel du callback fourni par AdminPanel
    } else {
      console.error("SmartlinkListPage: La fonction onNavigateToEdit n'a pas été fournie.");
    }
  };

  const handleCreateClick = () => {
    if (onNavigateToCreate) {
      onNavigateToCreate(); // Appel du callback fourni par AdminPanel
    } else {
      console.error("SmartlinkListPage: La fonction onNavigateToCreate n'a pas été fournie.");
    }
  }

  const handleViewPublicLink = (artistSlug, trackSlug) => {
    if (!artistSlug || !trackSlug) {
      toast.error("Slugs manquants, impossible d'ouvrir le lien.");
      return;
    }
    // Le chemin ici doit correspondre à votre configuration de route publique dans App.jsx
    // pour le composant SmartLinkPage.jsx public
    const publicUrl = `/smartlink/${artistSlug}/${trackSlug}`; 
    window.open(publicUrl, '_blank');
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le SmartLink "${title}" ? Cette action est irréversible.`)) {
      try {
        setLoading(true); // Peut-être un état de chargement spécifique pour la suppression
        await apiService.smartlinks.deleteById(id);
        toast.success(`SmartLink "${title}" supprimé avec succès.`);
        fetchSmartlinks(); // Recharger la liste
      } catch (err) {
        console.error("SmartlinkListPage - Failed to delete SmartLink:", err);
        const errorMsg = err.message || err.data?.error || 'Erreur lors de la suppression du SmartLink.';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Définition des colonnes pour le DataGrid
  // L'annotation de type TypeScript ': GridColDef[]' a été enlevée.
  const columns = [
    {
      field: 'coverImageUrl', headerName: 'Pochette', width: 80,
      renderCell: (params) => params.value ? (<img src={params.value} alt={params.row.trackTitle} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />) : null,
      sortable: false, filterable: false,
    },
    { field: 'trackTitle', headerName: 'Titre', flex: 1, minWidth: 150 },
    { field: 'artistName', headerName: 'Artiste', flex: 0.8, minWidth: 120 },
    {
      field: 'isPublished', headerName: 'Statut', width: 120,
      renderCell: (params) => (<Chip label={params.value ? 'Publié' : 'Brouillon'} color={params.value ? 'success' : 'default'} size="small" />),
    },
    { field: 'viewCount', headerName: 'Vues', type: 'number', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'platformClickCount', headerName: 'Clics Plateforme', type: 'number', width: 150, align: 'center', headerAlign: 'center' },
    {
      field: 'createdAt', headerName: 'Créé le', type: 'dateTime', width: 180,
      valueGetter: (value) => value && new Date(value), // Pour le tri/filtre
      renderCell: (params) => params.value && new Date(params.value).toLocaleDateString('fr-FR'), // Affichage localisé
    },
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 150,
      getActions: ({ row }) => [
        <Tooltip title="Voir le SmartLink public" key={`view-${row.id}`}>
          <GridActionsCellItem
            icon={<VisibilityIcon />} label="Voir"
            onClick={() => handleViewPublicLink(row.artistId?.slug, row.slug)}
            disabled={!row.isPublished || !row.artistId?.slug || !row.slug}
            color="inherit"
          />
        </Tooltip>,
        <Tooltip title="Modifier" key={`edit-${row.id}`}>
          <GridActionsCellItem
            icon={<EditIcon />} label="Modifier"
            onClick={() => handleEditClick(row.id)}
            color="primary"
          />
        </Tooltip>,
        <Tooltip title="Supprimer" key={`delete-${row.id}`}>
          <GridActionsCellItem
            icon={<DeleteIcon />} label="Supprimer"
            onClick={() => handleDelete(row.id, row.trackTitle)}
            color="error"
          />
        </Tooltip>,
      ],
    },
  ];

  if (loading && smartlinks.length === 0) { // Afficher le spinner seulement au chargement initial si la liste est vide
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 5 }}>
        <CircularProgress size={50} />
        <Typography sx={{ mt: 2 }} variant="h6">Chargement des SmartLinks...</Typography>
      </Box>
    );
  }

  return (
    // Utiliser des classes CSS de votre admin.css si vous voulez un style non-MUI
    // ou des composants Paper/Box de MUI pour la structure.
    // Ce code utilise MUI pour la structure de la page de liste.
    <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, width: '100%', overflow: 'hidden', borderRadius: "8px" }}>
      {error && !loading && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}> 
          {/* Adaptez le titre si besoin, ex: t('admin.smartlinks_title') */}
          Gestion des SmartLinks
        </Typography>
        <Button
          variant="contained" // Style MUI
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateClick} // Appel de la fonction passée en prop
          // className="btn btn-primary" // Si vous voulez utiliser vos classes CSS
        >
          Nouveau SmartLink
        </Button>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}> {/* Hauteur fixe pour DataGrid */}
        <DataGrid
          rows={smartlinks}
          columns={columns}
          loading={loading} // DataGrid a son propre indicateur de chargement
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
          }}
          density="standard"
          autoHeight={false} // Important si la hauteur du Box est définie
        />
      </Box>
    </Paper>
  );
}

export default SmartlinkListPage;
