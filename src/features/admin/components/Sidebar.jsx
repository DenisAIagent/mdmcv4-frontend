import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Link as SmartLinkIcon,
  Person as ArtistIcon,
  RateReview as ReviewIcon,
  Article as ContentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: t('admin.dashboard_nav'), icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: t('admin.smartlinks_nav'), icon: <SmartLinkIcon />, path: '/admin/smartlinks' },
    { text: t('admin.artists_nav'), icon: <ArtistIcon />, path: '/admin/artists' },
    { text: t('admin.reviews_nav'), icon: <ReviewIcon />, path: '/admin/reviews' },
    { text: t('admin.content_nav'), icon: <ContentIcon />, path: '/admin/content' },
    { text: t('admin.settings_nav'), icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );
};

export default Sidebar; 