import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Paper,
} from '@mui/material';
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import apiService from '@/services/api.service';

const SmartLinkList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [smartLinks, setSmartLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSmartLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.smartlinks.getAll();
      if (response.success && Array.isArray(response.data)) {
        setSmartLinks(response.data);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des SmartLinks');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des SmartLinks:', err);
      setError(err.message || 'Une erreur est survenue');
      toast.error(err.message || 'Impossible de charger les SmartLinks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmartLinks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce SmartLink ?')) {
      try {
        const response = await apiService.smartlinks.delete(id);
        if (response.success) {
          toast.success('SmartLink supprimé avec succès');
          fetchSmartLinks(); // Recharger la liste
        } else {
          throw new Error(response.error || 'Erreur lors de la suppression');
        }
      } catch (err) {
        console.error('Erreur lors de la suppression du SmartLink:', err);
        toast.error(err.message || 'Impossible de supprimer le SmartLink');
      }
    }
  };

  const columns = [
    {
      field: 'trackTitle',
      headerName: t('admin.smartlinks.track_title'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'artist',
      headerName: t('admin.smartlinks.artist'),
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params.row.artistId?.name || '-',
    },
    {
      field: 'releaseDate',
      headerName: t('admin.smartlinks.release_date'),
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.row.releaseDate ? new Date(params.row.releaseDate).toLocaleDateString() : '-',
    },
    {
      field: 'isPublished',
      headerName: t('admin.smartlinks.status'),
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.value ? 'success.main' : 'warning.main',
            fontWeight: 'medium',
          }}
        >
          {params.value ? t('admin.smartlinks.published') : t('admin.smartlinks.draft')}
        </Typography>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('admin.smartlinks.actions'),
      flex: 1,
      minWidth: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title={t('admin.smartlinks.view')}>
              <ViewIcon />
            </Tooltip>
          }
          label={t('admin.smartlinks.view')}
          onClick={() => window.open(`/smartlinks/${params.row.artistId?.slug}/${params.row.slug}`, '_blank')}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('admin.smartlinks.edit')}>
              <EditIcon />
            </Tooltip>
          }
          label={t('admin.smartlinks.edit')}
          onClick={() => navigate(`/admin/smartlinks/edit/${params.row._id}`)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('admin.smartlinks.delete')}>
              <DeleteIcon />
            </Tooltip>
          }
          label={t('admin.smartlinks.delete')}
          onClick={() => handleDelete(params.row._id)}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          {t('admin.smartlinks.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/smartlinks/new')}
        >
          {t('admin.smartlinks.create')}
        </Button>
      </Box>

      <Paper sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <DataGrid
          rows={smartLinks}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
            sorting: {
              sortModel: [{ field: 'releaseDate', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </Paper>
    </Box>
  );
};

export default SmartLinkList; 