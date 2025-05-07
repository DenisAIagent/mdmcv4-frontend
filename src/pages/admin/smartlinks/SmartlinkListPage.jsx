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
  Chip, // Pour afficher le statut Publié/Brouillon
  Link as MuiLink, // Pour le lien vers la page publique
  Tooltip,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Pour voir le SmartLink
import { toast } from 'react-toastify';

import apiService from '@/services/api.service'; // Vérifiez le chemin

function SmartlinkListPage() {
  const [smartlinks, setSmartlinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fonction pour récupérer les SmartLinks, mise en cache avec useCallback
  const fetchSmartlinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching SmartLinks from API...");
      // Méthode à créer/utiliser : apiService.smartlinks.getAll()
      const response = await apiService.smartlinks.getAll();
      console.log("API response for SmartLinks:", response);

      // DataGrid a besoin d'un champ 'id'. On utilise '_id' de MongoDB.
      // Assurez-vous que votre API retourne bien '_id' et peuple 'artistId' avec au moins le nom.
      const smartlinksWithId = (response.data || []).map(sl => ({
        ...sl,
        id: sl._id,
        artistName: sl.artistId?.name || 'Artiste inconnu', // Afficher le nom de l'artiste
        clickCount: sl.clickCount || 0, // Assurer une valeur par défaut pour clickCount
      }));
      setSmartlinks(smartlinksWithId);
    } catch (err) {
      console.error("Failed to fetch SmartLinks:", err);
      const errorMsg = err.response?.data?.message || err.message || 'Erreur serveur lors du chargement des SmartLinks.';
      setError(errorMsg);
      toast.error(errorMsg);
      setSmartlinks([]);
    } finally {
      setLoading(false);
    }
  }, []); // useCallback n'a pas de dépendances car il ne dépend pas de props ou state externes pour sa logique interne

  // Récupérer les SmartLinks au montage du composant
  useEffect(() => {
    fetchSmartlinks();
  }, [fetchSmartlinks]); // fetchSmartlinks est maintenant une dépendance stable grâce à useCallback

  const handleEdit = (id) => {
    console.log("Edit SmartLink with ID:", id);
    navigate(`/admin/smartlinks/edit/${id}`); // Route pour l'édition
  };

  const handleView = (artistSlug, trackSlug) => {
    if (!artistSlug || !trackSlug) {
      toast.error("Slugs manquants, impossible d'ouvrir le lien.");
      return;
    }
    // Construire l'URL publique. Adaptez si votre structure d'URL est différente.
    const publicUrl = `/smartlinks/${artistSlug}/${trackSlug}`;
    window.open(publicUrl, '_blank'); // Ouvre dans un nouvel onglet
  };

  const handleDelete = async (id, title) => {
    console.log("Delete SmartLink with ID:", id);
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le SmartLink "${title}" ? Cette action est irréversible.`)) {
      try {
        setLoading(true); // Afficher un indicateur pendant la suppression
        // Méthode à créer/utiliser : apiService.smartlinks.delete(id)
        await apiService.smartlinks.delete(id);
        toast.success(`SmartLink "${title}" supprimé avec succès.`);
        fetchSmartlinks(); // Recharger la liste après suppression
      } catch (err) {
        console.error("Failed to delete SmartLink:", err);
        const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la suppression du SmartLink.';
        setError(errorMsg); // Afficher l'erreur sur la page
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  // Définition des colonnes pour le DataGrid
  const columns: GridColDef[] = [
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
    { field: 'trackTitle', headerName: 'Titre du morceau', width: 250, flex: 1 },
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
      field: 'clickCount',
      headerName: 'Clics',
      type: 'number',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'createdAt',
      headerName: 'Créé le',
      type: 'dateTime',
      width: 180,
      valueGetter: (value) => value && new Date(value), // S'assurer que c'est un objet Date pour le tri/filtrage
      renderCell: (params) => params.value && new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ row }) => [
        <Tooltip title="Voir le SmartLink">
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="Voir"
            onClick={() => handleView(row.artistId?.slug, row.slug)} // Assurez-vous que artistId.slug et row.slug (trackSlug) sont disponibles
            color="inherit"
            disabled={!row.isPublished || !row.artistId?.slug || !row.slug} // Désactiver si non publié ou slugs manquants
          />
        </Tooltip>,
        <Tooltip title="Modifier">
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Modifier"
            onClick={() => handleEdit(row.id)} // Utiliser row.id (qui est _id)
            color="primary"
          />
        </Tooltip>,
        <Tooltip title="Supprimer">
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

  if (loading && smartlinks.length === 0) { // Afficher le chargement initial seulement
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 150px)' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }} variant="h6">Chargement des SmartLinks...</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: { xs: 1, sm: 2 }, width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      {error && !loading && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Gestion des SmartLinks
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/smartlinks/new')} // Route pour la création
        >
          Nouveau SmartLink
        </Button>
      </Box>

      <Box sx={{ height: 'calc(100vh - 240px)', minHeight: 400, width: '100%' }}> {/* Hauteur ajustable */}
        <DataGrid
          rows={smartlinks}
          columns={columns}
          loading={loading} // DataGrid gère son propre indicateur de chargement pour les mises à jour
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
            sorting: { // Tri par défaut par date de création décroissante
              sortModel: [{ field: 'createdAt', sort: 'desc' }],
            },
          }}
          density="compact" // Pour une table plus dense
          // autoHeight // Décommentez si vous préférez que la table s'ajuste à son contenu, mais peut impacter la perf sur de grands ensembles
        />
      </Box>
    </Paper>
  );
}

export default SmartlinkListPage;
