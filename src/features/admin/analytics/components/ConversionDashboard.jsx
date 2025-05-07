import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  ButtonGroup,
  Tooltip,
  IconButton,
  Chip,
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Snackbar,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText as MuiListItemText,
  TextareaAutosize,
  Radio,
  RadioGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Download,
  Refresh,
  Settings,
  MoreVert,
  TableChart,
  PictureAsPdf,
  CompareArrows,
  FilterList,
  Assessment,
  Description,
  Schedule,
  Business,
  Timeline,
  Map,
  People,
  Save,
  Add,
  Delete,
  Edit,
  Palette,
  ViewModule,
  ViewList,
  ViewQuilt,
  TableView,
  TableRows
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../../../services/api.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const SOURCES = {
  GA4: 'Google Analytics 4',
  GOOGLE_ADS: 'Google Ads',
  META: 'Meta Pixel',
  TIKTOK: 'TikTok Pixel'
};

const QUICK_RANGES = [
  { label: '7j', days: 7 },
  { label: '30j', days: 30 },
  { label: '90j', days: 90 },
  { label: '1an', days: 365 }
];

const ALERT_THRESHOLDS = {
  CONVERSION_RATE: 10, // 10% de variation
  CONVERSION_VALUE: 20, // 20% de variation
  TIME_TO_CONVERT: 15  // 15% de variation
};

const PLATFORMS = [
  'Spotify',
  'Apple Music',
  'Deezer',
  'YouTube Music',
  'Amazon Music',
  'Tidal'
];

const COUNTRIES = [
  'France',
  'États-Unis',
  'Royaume-Uni',
  'Allemagne',
  'Espagne',
  'Italie',
  'Canada',
  'Japon'
];

const REPORT_TEMPLATES = {
  PERFORMANCE: {
    id: 'performance',
    name: 'Rapport de Performance',
    description: 'Analyse détaillée des performances de conversion',
    sections: ['metrics', 'platforms', 'trends', 'alerts']
  },
  MARKETING: {
    id: 'marketing',
    name: 'Rapport Marketing',
    description: 'Analyse des campagnes et des sources de trafic',
    sections: ['metrics', 'platforms', 'trends', 'countries']
  },
  EXECUTIVE: {
    id: 'executive',
    name: 'Rapport Exécutif',
    description: 'Vue d\'ensemble pour la direction',
    sections: ['metrics', 'trends', 'alerts']
  }
};

const REPORT_SECTIONS = {
  metrics: {
    id: 'metrics',
    name: 'Métriques Principales',
    description: 'Vue d\'ensemble des KPIs principaux',
    icon: <Assessment />
  },
  platforms: {
    id: 'platforms',
    name: 'Performance par Plateforme',
    description: 'Analyse détaillée par plateforme de streaming',
    icon: <Business />
  },
  trends: {
    id: 'trends',
    name: 'Tendances',
    description: 'Évolution des conversions dans le temps',
    icon: <Timeline />
  },
  countries: {
    id: 'countries',
    name: 'Répartition Géographique',
    description: 'Analyse par pays',
    icon: <Map />
  },
  alerts: {
    id: 'alerts',
    name: 'Alertes et Anomalies',
    description: 'Points d\'attention et variations significatives',
    icon: <TrendingUp />
  }
};

const LAYOUT_OPTIONS = {
  COMPACT: {
    id: 'compact',
    name: 'Compact',
    description: 'Mise en page optimisée pour l\'impression',
    icon: <ViewList />
  },
  DETAILED: {
    id: 'detailed',
    name: 'Détaillé',
    description: 'Mise en page avec plus d\'espace',
    icon: <ViewModule />
  },
  MODERN: {
    id: 'modern',
    name: 'Moderne',
    description: 'Mise en page avec graphiques',
    icon: <ViewQuilt />
  }
};

const EXPORT_FORMATS = {
  PDF: {
    id: 'pdf',
    name: 'PDF',
    description: 'Format PDF avec mise en page',
    icon: <PictureAsPdf />
  },
  EXCEL: {
    id: 'excel',
    name: 'Excel',
    description: 'Format Excel avec onglets',
    icon: <TableChart />
  },
  CSV: {
    id: 'csv',
    name: 'CSV',
    description: 'Format CSV pour l\'analyse',
    icon: <TableRows />
  }
};

const ConversionDashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSource, setSelectedSource] = useState('GA4');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });
  const [conversionData, setConversionData] = useState({
    totalConversions: 0,
    totalConversionValue: 0,
    conversionRate: 0,
    averageTimeToConvert: 0,
    platformBreakdown: [],
    dailyData: []
  });
  const [previousData, setPreviousData] = useState(null);
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedSingle, setSelectedSingle] = useState(null);
  const [chartOptions, setChartOptions] = useState({
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    showValueLabels: false
  });
  const [chartOptionsOpen, setChartOptionsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareData, setCompareData] = useState(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('performance');
  const [selectedSections, setSelectedSections] = useState([]);
  const [reportNotes, setReportNotes] = useState('');
  const [reportFrequency, setReportFrequency] = useState('once');
  const [reportSchedule, setReportSchedule] = useState({
    frequency: 'weekly',
    day: 'monday',
    time: '09:00'
  });
  const [customTemplates, setCustomTemplates] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState('modern');
  const [showGraphs, setShowGraphs] = useState(true);
  const [templateName, setTemplateName] = useState('');
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeGraphs: true,
    includeNotes: true,
    separateSheets: true,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'fr-FR'
  });

  useEffect(() => {
    fetchConversionData();
  }, [selectedSource, dateRange]);

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    if (selectedArtist) {
      fetchSingles(selectedArtist.id);
    }
  }, [selectedArtist]);

  const fetchConversionData = async () => {
    try {
      setLoading(true);
      const response = await apiService.analytics.getConversions({
        source: selectedSource,
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString()
      });
      
      // Sauvegarder les données précédentes pour le calcul des variations
      setPreviousData(conversionData);
      setConversionData(response.data);
      setError(null);
    } catch (err) {
      setError(t('admin.analytics.error_loading_data'));
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await apiService.artists.getAll();
      setArtists(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des artistes:', error);
    }
  };

  const fetchSingles = async (artistId) => {
    try {
      const response = await apiService.singles.getByArtist(artistId);
      setSingles(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des singles:', error);
    }
  };

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };

  const handleDateChange = (field) => (date) => {
    setDateRange(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleQuickRange = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    setDateRange({ startDate, endDate });
  };

  const calculateVariation = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}min`;
  };

  const handleExport = async () => {
    try {
      const reportData = {
        metrics: {
          totalConversions: conversionData.totalConversions,
          totalConversionValue: conversionData.totalConversionValue,
          conversionRate: conversionData.conversionRate,
          averageTimeToConvert: conversionData.averageTimeToConvert
        },
        platforms: conversionData.platformBreakdown,
        trends: conversionData.dailyData,
        alerts: alerts
      };

      switch (exportFormat) {
        case 'excel':
          exportToExcel(reportData);
          break;
        case 'csv':
          exportToCSV(reportData);
          break;
        default:
          generateReport();
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setError(t('admin.analytics.export_error'));
    }
  };

  const checkAlerts = (currentData, previousData) => {
    const newAlerts = [];
    
    if (previousData) {
      const rateVariation = calculateVariation(currentData.conversionRate, previousData.conversionRate);
      if (Math.abs(rateVariation) > ALERT_THRESHOLDS.CONVERSION_RATE) {
        newAlerts.push({
          type: 'conversion_rate',
          message: `Variation significative du taux de conversion: ${rateVariation.toFixed(1)}%`,
          severity: rateVariation > 0 ? 'success' : 'warning'
        });
      }

      const valueVariation = calculateVariation(currentData.totalConversionValue, previousData.totalConversionValue);
      if (Math.abs(valueVariation) > ALERT_THRESHOLDS.CONVERSION_VALUE) {
        newAlerts.push({
          type: 'conversion_value',
          message: `Variation significative de la valeur des conversions: ${valueVariation.toFixed(1)}%`,
          severity: valueVariation > 0 ? 'success' : 'warning'
        });
      }

      const timeVariation = calculateVariation(currentData.averageTimeToConvert, previousData.averageTimeToConvert);
      if (Math.abs(timeVariation) > ALERT_THRESHOLDS.TIME_TO_CONVERT) {
        newAlerts.push({
          type: 'time_to_convert',
          message: `Variation significative du temps de conversion: ${timeVariation.toFixed(1)}%`,
          severity: timeVariation < 0 ? 'success' : 'warning'
        });
      }
    }

    setAlerts(newAlerts);
  };

  const handleChartOptionsChange = (option) => (event) => {
    setChartOptions(prev => ({
      ...prev,
      [option]: event.target.checked
    }));
  };

  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const exportToExcel = (data) => {
    const workbook = XLSX.utils.book_new();

    // Onglet Résumé
    const summaryData = [
      ['Rapport de Conversions'],
      ['Source', SOURCES[selectedSource]],
      ['Période', `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`],
      [],
      ['Métriques Principales'],
      ['Total Conversions', data.metrics.totalConversions],
      ['Valeur Totale', formatCurrency(data.metrics.totalConversionValue)],
      ['Taux de Conversion', `${(data.metrics.conversionRate * 100).toFixed(2)}%`],
      ['Temps Moyen', formatTime(data.metrics.averageTimeToConvert)]
    ];

    if (exportOptions.includeNotes && reportNotes) {
      summaryData.push([], ['Notes'], [reportNotes]);
    }

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé');

    // Onglet Plateformes
    const platformsData = [
      ['Plateforme', 'Conversions', 'Clics', 'Valeur', 'Taux de Conversion'],
      ...data.platforms.map(platform => [
        platform.platform,
        platform.conversions,
        platform.clicks,
        platform.conversionValue,
        `${(platform.conversions / platform.clicks * 100).toFixed(2)}%`
      ])
    ];
    const platformsSheet = XLSX.utils.aoa_to_sheet(platformsData);
    XLSX.utils.book_append_sheet(workbook, platformsSheet, 'Plateformes');

    // Onglet Tendances
    const trendsData = [
      ['Date', 'Conversions', 'Clics', 'Taux', 'Valeur'],
      ...data.trends.map(day => [
        day.date,
        day.conversions,
        day.clicks,
        `${day.conversionRate.toFixed(2)}%`,
        day.conversionValue
      ])
    ];
    const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData);
    XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Tendances');

    // Alertes
    if (data.alerts.length > 0) {
      const alertsData = [
        ['Type', 'Message', 'Sévérité'],
        ...data.alerts.map(alert => [
          alert.type,
          alert.message,
          alert.severity
        ])
      ];
      const alertsSheet = XLSX.utils.aoa_to_sheet(alertsData);
      XLSX.utils.book_append_sheet(workbook, alertsSheet, 'Alertes');
    }

    // Styles et formatage
    const wscols = [
      { wch: 20 }, // Largeur des colonnes
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];

    Object.keys(workbook.Sheets).forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      sheet['!cols'] = wscols;
    });

    // Sauvegarder le fichier
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `rapport-conversions-${selectedSource}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToCSV = (data) => {
    const sections = [];

    // En-tête
    sections.push(
      'Rapport de Conversions',
      `Source: ${SOURCES[selectedSource]}`,
      `Période: ${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`,
      ''
    );

    // Métriques
    sections.push(
      'Métriques Principales',
      'Métrique,Valeur',
      `Total Conversions,${data.metrics.totalConversions}`,
      `Valeur Totale,${formatCurrency(data.metrics.totalConversionValue)}`,
      `Taux de Conversion,${(data.metrics.conversionRate * 100).toFixed(2)}%`,
      `Temps Moyen,${formatTime(data.metrics.averageTimeToConvert)}`,
      ''
    );

    // Notes
    if (exportOptions.includeNotes && reportNotes) {
      sections.push('Notes', reportNotes, '');
    }

    // Plateformes
    sections.push(
      'Performance par Plateforme',
      'Plateforme,Conversions,Clics,Valeur,Taux de Conversion',
      ...data.platforms.map(platform => 
        `${platform.platform},${platform.conversions},${platform.clicks},${platform.conversionValue},${(platform.conversions / platform.clicks * 100).toFixed(2)}%`
      ),
      ''
    );

    // Tendances
    sections.push(
      'Tendances Quotidiennes',
      'Date,Conversions,Clics,Taux,Valeur',
      ...data.trends.map(day =>
        `${day.date},${day.conversions},${day.clicks},${day.conversionRate.toFixed(2)}%,${day.conversionValue}`
      ),
      ''
    );

    // Alertes
    if (data.alerts.length > 0) {
      sections.push(
        'Alertes et Anomalies',
        'Type,Message,Sévérité',
        ...data.alerts.map(alert =>
          `${alert.type},${alert.message},${alert.severity}`
        )
      );
    }

    // Générer le fichier CSV
    const csvContent = sections.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `rapport-conversions-${selectedSource}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(16);
    doc.text('Rapport de Conversions', 14, 15);
    doc.setFontSize(10);
    doc.text(`Source: ${SOURCES[selectedSource]}`, 14, 25);
    doc.text(`Période: ${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`, 14, 30);

    // Métriques principales
    doc.autoTable({
      startY: 35,
      head: [['Métrique', 'Valeur']],
      body: [
        ['Total Conversions', conversionData.totalConversions],
        ['Valeur Totale', formatCurrency(conversionData.totalConversionValue)],
        ['Taux de Conversion', `${(conversionData.conversionRate * 100).toFixed(2)}%`],
        ['Temps Moyen', formatTime(conversionData.averageTimeToConvert)]
      ]
    });

    // Données par plateforme
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Plateforme', 'Conversions', 'Clics', 'Taux', 'Valeur']],
      body: conversionData.platformBreakdown.map(platform => [
        platform.platform,
        platform.conversions,
        platform.clicks,
        `${platform.conversionRate.toFixed(2)}%`,
        platform.conversionValue
      ])
    });

    // Données quotidiennes
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Date', 'Conversions', 'Clics', 'Taux', 'Valeur']],
      body: conversionData.dailyData.map(day => [
        day.date,
        day.conversions,
        day.clicks,
        `${day.conversionRate.toFixed(2)}%`,
        day.conversionValue
      ])
    });

    doc.save(`rapport-conversions-${selectedSource}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const toggleCompareMode = () => {
    if (!compareMode) {
      // Sauvegarder les données actuelles pour la comparaison
      setCompareData(conversionData);
    } else {
      // Réinitialiser les données de comparaison
      setCompareData(null);
    }
    setCompareMode(!compareMode);
  };

  const handleReportDialogOpen = () => {
    setReportDialogOpen(true);
    setSelectedSections(REPORT_TEMPLATES[selectedTemplate].sections);
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    setSelectedSections(REPORT_TEMPLATES[templateId].sections);
  };

  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const saveCustomTemplate = () => {
    const newTemplate = {
      id: isEditingTemplate ? editingTemplateId : `custom_${Date.now()}`,
      name: templateName,
      description: `Template personnalisé: ${templateName}`,
      sections: selectedSections,
      layout: selectedLayout,
      showGraphs
    };

    if (isEditingTemplate) {
      setCustomTemplates(prev => 
        prev.map(t => t.id === editingTemplateId ? newTemplate : t)
      );
    } else {
      setCustomTemplates(prev => [...prev, newTemplate]);
    }

    // Sauvegarder dans le localStorage
    localStorage.setItem('customReportTemplates', JSON.stringify([...customTemplates, newTemplate]));
    
    setTemplateName('');
    setIsEditingTemplate(false);
    setEditingTemplateId(null);
  };

  const deleteCustomTemplate = (templateId) => {
    const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updatedTemplates);
    localStorage.setItem('customReportTemplates', JSON.stringify(updatedTemplates));
  };

  const editCustomTemplate = (template) => {
    setTemplateName(template.name);
    setSelectedSections(template.sections);
    setSelectedLayout(template.layout);
    setShowGraphs(template.showGraphs);
    setIsEditingTemplate(true);
    setEditingTemplateId(template.id);
  };

  const generateReport = async () => {
    try {
      const reportData = {
        template: selectedTemplate,
        sections: selectedSections,
        notes: reportNotes,
        frequency: reportFrequency,
        schedule: reportSchedule,
        layout: selectedLayout,
        showGraphs,
        data: {
          metrics: {
            totalConversions: conversionData.totalConversions,
            totalConversionValue: conversionData.totalConversionValue,
            conversionRate: conversionData.conversionRate,
            averageTimeToConvert: conversionData.averageTimeToConvert
          },
          platforms: conversionData.platformBreakdown,
          trends: conversionData.dailyData,
          alerts: alerts
        }
      };

      // Générer le PDF
      const doc = new jsPDF();
      
      // En-tête avec style selon la mise en page
      doc.setFontSize(selectedLayout === 'modern' ? 24 : 20);
      doc.setTextColor(selectedLayout === 'modern' ? '#1976d2' : '#000000');
      doc.text('Rapport de Conversions', 14, 20);
      
      doc.setFontSize(selectedLayout === 'modern' ? 14 : 12);
      doc.setTextColor('#666666');
      doc.text(`Source: ${SOURCES[selectedSource]}`, 14, 30);
      doc.text(`Période: ${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`, 14, 35);

      // Notes avec style amélioré
      if (reportNotes) {
        doc.setFontSize(12);
        doc.setTextColor('#1976d2');
        doc.text('Notes:', 14, 45);
        doc.setFontSize(10);
        doc.setTextColor('#333333');
        const splitNotes = doc.splitTextToSize(reportNotes, 180);
        doc.text(splitNotes, 14, 50);
      }

      let yPosition = reportNotes ? 50 + (splitNotes.length * 5) : 45;

      // Sections sélectionnées avec graphiques si activés
      selectedSections.forEach(sectionId => {
        const section = REPORT_SECTIONS[sectionId];
        doc.setFontSize(selectedLayout === 'modern' ? 16 : 14);
        doc.setTextColor('#1976d2');
        doc.text(section.name, 14, yPosition + 10);
        yPosition += 15;

        // Ajouter des graphiques si activés
        if (showGraphs) {
          switch (sectionId) {
            case 'metrics':
              // Graphique en camembert pour les métriques
              const metricsChart = generatePieChart([
                { label: 'Conversions', value: reportData.data.metrics.totalConversions },
                { label: 'Valeur', value: reportData.data.metrics.totalConversionValue }
              ]);
              doc.addImage(metricsChart, 'PNG', 14, yPosition, 80, 40);
              yPosition += 50;
              break;

            case 'platforms':
              // Graphique en barres pour les plateformes
              const platformsChart = generateBarChart(
                reportData.data.platforms.map(p => p.platform),
                reportData.data.platforms.map(p => p.conversions)
              );
              doc.addImage(platformsChart, 'PNG', 14, yPosition, 180, 60);
              yPosition += 70;
              break;

            case 'trends':
              // Graphique en ligne pour les tendances
              const trendsChart = generateLineChart(
                reportData.data.trends.map(t => t.date),
                reportData.data.trends.map(t => t.conversions)
              );
              doc.addImage(trendsChart, 'PNG', 14, yPosition, 180, 60);
              yPosition += 70;
              break;
          }
        }

        // Tableaux de données
        switch (sectionId) {
          case 'metrics':
            doc.autoTable({
              startY: yPosition,
              head: [['Métrique', 'Valeur']],
              body: [
                ['Total Conversions', reportData.data.metrics.totalConversions],
                ['Valeur Totale', formatCurrency(reportData.data.metrics.totalConversionValue)],
                ['Taux de Conversion', `${(reportData.data.metrics.conversionRate * 100).toFixed(2)}%`],
                ['Temps Moyen', formatTime(reportData.data.metrics.averageTimeToConvert)]
              ],
              theme: selectedLayout === 'modern' ? 'grid' : 'plain',
              styles: {
                fontSize: selectedLayout === 'compact' ? 8 : 10,
                cellPadding: selectedLayout === 'compact' ? 2 : 4
              }
            });
            break;

          case 'platforms':
            doc.autoTable({
              startY: yPosition,
              head: [['Plateforme', 'Conversions', 'Clics', 'Valeur']],
              body: reportData.data.platforms.map(platform => [
                platform.platform,
                platform.conversions,
                platform.clicks,
                formatCurrency(platform.conversionValue)
              ]),
              theme: selectedLayout === 'modern' ? 'grid' : 'plain',
              styles: {
                fontSize: selectedLayout === 'compact' ? 8 : 10,
                cellPadding: selectedLayout === 'compact' ? 2 : 4
              }
            });
            break;

          case 'trends':
            doc.autoTable({
              startY: yPosition,
              head: [['Date', 'Conversions', 'Clics', 'Taux', 'Valeur']],
              body: reportData.data.trends.map(day => [
                day.date,
                day.conversions,
                day.clicks,
                `${day.conversionRate.toFixed(2)}%`,
                formatCurrency(day.conversionValue)
              ]),
              theme: selectedLayout === 'modern' ? 'grid' : 'plain',
              styles: {
                fontSize: selectedLayout === 'compact' ? 8 : 10,
                cellPadding: selectedLayout === 'compact' ? 2 : 4
              }
            });
            break;

          case 'alerts':
            doc.autoTable({
              startY: yPosition,
              head: [['Type', 'Message']],
              body: reportData.data.alerts.map(alert => [
                alert.type,
                alert.message
              ]),
              theme: selectedLayout === 'modern' ? 'grid' : 'plain',
              styles: {
                fontSize: selectedLayout === 'compact' ? 8 : 10,
                cellPadding: selectedLayout === 'compact' ? 2 : 4
              }
            });
            break;
        }

        yPosition = doc.lastAutoTable.finalY + 10;
      });

      // Pied de page avec style
      doc.setFontSize(8);
      doc.setTextColor('#666666');
      doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.height - 10);

      // Sauvegarder le rapport
      doc.save(`rapport-conversions-${selectedSource}-${new Date().toISOString().split('T')[0]}.pdf`);

      // Si programmation activée
      if (reportFrequency !== 'once') {
        await apiService.reports.schedule({
          template: selectedTemplate,
          sections: selectedSections,
          frequency: reportFrequency,
          schedule: reportSchedule,
          email: 'user@example.com' // À remplacer par l'email de l'utilisateur
        });
      }

      handleReportDialogClose();
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      setError(t('admin.analytics.report_generation_error'));
    }
  };

  // Fonctions utilitaires pour générer les graphiques
  const generatePieChart = (data) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // ... logique de génération du graphique en camembert ...
    return canvas.toDataURL('image/png');
  };

  const generateBarChart = (labels, data) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // ... logique de génération du graphique en barres ...
    return canvas.toDataURL('image/png');
  };

  const generateLineChart = (labels, data) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // ... logique de génération du graphique en ligne ...
    return canvas.toDataURL('image/png');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center">
              <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
                {t('admin.analytics.conversion_dashboard')}
              </Typography>
              <Tooltip title={t('admin.analytics.refresh_data')}>
                <IconButton onClick={fetchConversionData} sx={{ ml: 1 }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>{t('admin.analytics.select_source')}</InputLabel>
              <Select
                value={selectedSource}
                onChange={handleSourceChange}
                label={t('admin.analytics.select_source')}
              >
                {Object.entries(SOURCES).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <Box sx={{ mb: 2 }}>
                <ButtonGroup variant="outlined" size="small" fullWidth>
                  {QUICK_RANGES.map(({ label, days }) => (
                    <Button
                      key={label}
                      onClick={() => handleQuickRange(days)}
                      variant={dateRange.startDate.getTime() === new Date(Date.now() - days * 24 * 60 * 60 * 1000).getTime() ? 'contained' : 'outlined'}
                    >
                      {label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DatePicker
                    label="Date de début"
                    value={dateRange.startDate}
                    onChange={handleDateChange('startDate')}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="Date de fin"
                    value={dateRange.endDate}
                    onChange={handleDateChange('endDate')}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              options={artists}
              getOptionLabel={(option) => option.name}
              value={selectedArtist}
              onChange={(_, newValue) => setSelectedArtist(newValue)}
              renderInput={(params) => (
                <TextField {...params} label={t('admin.analytics.select_artist')} />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              options={singles}
              getOptionLabel={(option) => option.title}
              value={selectedSingle}
              onChange={(_, newValue) => setSelectedSingle(newValue)}
              disabled={!selectedArtist}
              renderInput={(params) => (
                <TextField {...params} label={t('admin.analytics.select_single')} />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Box display="flex" gap={1}>
              <Button
                startIcon={<FilterList />}
                onClick={handleFilterMenuOpen}
                variant="outlined"
                size="small"
              >
                {t('admin.analytics.filters')}
              </Button>
              <Button
                startIcon={<CompareArrows />}
                onClick={toggleCompareMode}
                variant={compareMode ? 'contained' : 'outlined'}
                size="small"
              >
                {t('admin.analytics.compare')}
              </Button>
              <Button
                startIcon={<Download />}
                onClick={handleExportMenuOpen}
                variant="outlined"
                size="small"
              >
                {t('admin.analytics.export')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Alerts */}
      {alerts.map((alert, index) => (
        <Snackbar
          key={index}
          open={true}
          autoHideDuration={6000}
          onClose={() => setAlerts(prev => prev.filter((_, i) => i !== index))}
        >
          <Alert severity={alert.severity} onClose={() => setAlerts(prev => prev.filter((_, i) => i !== index))}>
            {alert.message}
          </Alert>
        </Snackbar>
      ))}

      {/* Menu d'export */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={handleExportMenuClose}
      >
        <MenuItem onClick={() => { handleExportMenuClose(); handleExport(); }}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>JSON</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleExportMenuClose(); exportToExcel(); }}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleExportMenuClose(); exportToPDF(); }}>
          <ListItemIcon>
            <PictureAsPdf fontSize="small" />
          </ListItemIcon>
          <ListItemText>PDF</ListItemText>
        </MenuItem>
      </Menu>

      {/* Menu de filtres */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
      >
        <MenuItem>
          <FormControl fullWidth>
            <Autocomplete
              multiple
              options={PLATFORMS}
              value={selectedPlatforms}
              onChange={(_, newValue) => setSelectedPlatforms(newValue)}
              renderInput={(params) => (
                <TextField {...params} label={t('admin.analytics.platforms')} />
              )}
            />
          </FormControl>
        </MenuItem>
        <Divider />
        <MenuItem>
          <FormControl fullWidth>
            <Autocomplete
              multiple
              options={COUNTRIES}
              value={selectedCountries}
              onChange={(_, newValue) => setSelectedCountries(newValue)}
              renderInput={(params) => (
                <TextField {...params} label={t('admin.analytics.countries')} />
              )}
            />
          </FormControl>
        </MenuItem>
      </Menu>

      <Grid container spacing={3}>
        {/* Métriques principales */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography color="textSecondary" sx={{ flex: 1 }}>
                  {t('admin.analytics.total_conversions')}
                </Typography>
                <Tooltip title={t('admin.analytics.conversions_tooltip')}>
                  <Info fontSize="small" color="action" />
                </Tooltip>
              </Box>
              <Typography variant="h4">
                {conversionData.totalConversions.toLocaleString()}
              </Typography>
              {previousData && (
                <Box display="flex" alignItems="center" mt={1}>
                  {calculateVariation(conversionData.totalConversions, previousData.totalConversions) > 0 ? (
                    <TrendingUp color="success" fontSize="small" />
                  ) : (
                    <TrendingDown color="error" fontSize="small" />
                  )}
                  <Typography
                    variant="body2"
                    color={calculateVariation(conversionData.totalConversions, previousData.totalConversions) > 0 ? 'success.main' : 'error.main'}
                    sx={{ ml: 0.5 }}
                  >
                    {Math.abs(calculateVariation(conversionData.totalConversions, previousData.totalConversions)).toFixed(1)}%
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography color="textSecondary" sx={{ flex: 1 }}>
                  {t('admin.analytics.conversion_value')}
                </Typography>
                <Tooltip title={t('admin.analytics.value_tooltip')}>
                  <Info fontSize="small" color="action" />
                </Tooltip>
              </Box>
              <Typography variant="h4">
                {formatCurrency(conversionData.totalConversionValue)}
              </Typography>
              {previousData && (
                <Box display="flex" alignItems="center" mt={1}>
                  {calculateVariation(conversionData.totalConversionValue, previousData.totalConversionValue) > 0 ? (
                    <TrendingUp color="success" fontSize="small" />
                  ) : (
                    <TrendingDown color="error" fontSize="small" />
                  )}
                  <Typography
                    variant="body2"
                    color={calculateVariation(conversionData.totalConversionValue, previousData.totalConversionValue) > 0 ? 'success.main' : 'error.main'}
                    sx={{ ml: 0.5 }}
                  >
                    {Math.abs(calculateVariation(conversionData.totalConversionValue, previousData.totalConversionValue)).toFixed(1)}%
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography color="textSecondary" sx={{ flex: 1 }}>
                  {t('admin.analytics.conversion_rate')}
                </Typography>
                <Tooltip title={t('admin.analytics.rate_tooltip')}>
                  <Info fontSize="small" color="action" />
                </Tooltip>
              </Box>
              <Typography variant="h4">
                {(conversionData.conversionRate * 100).toFixed(2)}%
              </Typography>
              {previousData && (
                <Box display="flex" alignItems="center" mt={1}>
                  {calculateVariation(conversionData.conversionRate, previousData.conversionRate) > 0 ? (
                    <TrendingUp color="success" fontSize="small" />
                  ) : (
                    <TrendingDown color="error" fontSize="small" />
                  )}
                  <Typography
                    variant="body2"
                    color={calculateVariation(conversionData.conversionRate, previousData.conversionRate) > 0 ? 'success.main' : 'error.main'}
                    sx={{ ml: 0.5 }}
                  >
                    {Math.abs(calculateVariation(conversionData.conversionRate, previousData.conversionRate)).toFixed(1)}%
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography color="textSecondary" sx={{ flex: 1 }}>
                  {t('admin.analytics.avg_conversion_time')}
                </Typography>
                <Tooltip title={t('admin.analytics.time_tooltip')}>
                  <Info fontSize="small" color="action" />
                </Tooltip>
              </Box>
              <Typography variant="h4">
                {formatTime(conversionData.averageTimeToConvert)}
              </Typography>
              {previousData && (
                <Box display="flex" alignItems="center" mt={1}>
                  {calculateVariation(conversionData.averageTimeToConvert, previousData.averageTimeToConvert) < 0 ? (
                    <TrendingUp color="success" fontSize="small" />
                  ) : (
                    <TrendingDown color="error" fontSize="small" />
                  )}
                  <Typography
                    variant="body2"
                    color={calculateVariation(conversionData.averageTimeToConvert, previousData.averageTimeToConvert) < 0 ? 'success.main' : 'error.main'}
                    sx={{ ml: 0.5 }}
                  >
                    {Math.abs(calculateVariation(conversionData.averageTimeToConvert, previousData.averageTimeToConvert)).toFixed(1)}%
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Graphique des conversions par plateforme */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                {t('admin.analytics.conversions_by_platform')}
              </Typography>
              <Button
                startIcon={<Download />}
                onClick={handleExport}
                variant="outlined"
                size="small"
              >
                {t('admin.analytics.export_data')}
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData.platformBreakdown}>
                {chartOptions.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                <XAxis dataKey="platform" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                {chartOptions.showTooltip && (
                  <RechartsTooltip
                    formatter={(value, name) => {
                      if (name === 'conversionValue') return formatCurrency(value);
                      return value;
                    }}
                  />
                )}
                {chartOptions.showLegend && <Legend />}
                <Bar
                  yAxisId="left"
                  dataKey="conversions"
                  fill="#8884d8"
                  name={t('admin.analytics.conversions')}
                  label={chartOptions.showValueLabels ? { position: 'top' } : false}
                />
                <Bar
                  yAxisId="left"
                  dataKey="clicks"
                  fill="#82ca9d"
                  name={t('admin.analytics.clicks')}
                  label={chartOptions.showValueLabels ? { position: 'top' } : false}
                />
                <Bar
                  yAxisId="right"
                  dataKey="conversionValue"
                  fill="#ffc658"
                  name={t('admin.analytics.conversion_value')}
                  label={chartOptions.showValueLabels ? { position: 'top' } : false}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Graphique des tendances quotidiennes */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('admin.analytics.daily_trends')}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionData.dailyData}>
                {chartOptions.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                {chartOptions.showTooltip && (
                  <RechartsTooltip
                    formatter={(value, name) => {
                      if (name === 'conversionValue') return formatCurrency(value);
                      if (name === 'conversionRate') return `${value.toFixed(2)}%`;
                      return value;
                    }}
                  />
                )}
                {chartOptions.showLegend && <Legend />}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="conversions"
                  stroke="#8884d8"
                  name={t('admin.analytics.conversions')}
                  dot={chartOptions.showValueLabels}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="clicks"
                  stroke="#82ca9d"
                  name={t('admin.analytics.clicks')}
                  dot={chartOptions.showValueLabels}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversionRate"
                  stroke="#ff7300"
                  name={t('admin.analytics.conversion_rate')}
                  dot={chartOptions.showValueLabels}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversionValue"
                  stroke="#ffc658"
                  name={t('admin.analytics.conversion_value')}
                  dot={chartOptions.showValueLabels}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Chart Options Dialog */}
      <Dialog open={chartOptionsOpen} onClose={() => setChartOptionsOpen(false)}>
        <DialogTitle>{t('admin.analytics.chart_options')}</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={chartOptions.showGrid}
                onChange={handleChartOptionsChange('showGrid')}
              />
            }
            label={t('admin.analytics.show_grid')}
          />
          <FormControlLabel
            control={
              <Switch
                checked={chartOptions.showLegend}
                onChange={handleChartOptionsChange('showLegend')}
              />
            }
            label={t('admin.analytics.show_legend')}
          />
          <FormControlLabel
            control={
              <Switch
                checked={chartOptions.showTooltip}
                onChange={handleChartOptionsChange('showTooltip')}
              />
            }
            label={t('admin.analytics.show_tooltip')}
          />
          <FormControlLabel
            control={
              <Switch
                checked={chartOptions.showValueLabels}
                onChange={handleChartOptionsChange('showValueLabels')}
              />
            }
            label={t('admin.analytics.show_value_labels')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChartOptionsOpen(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Graphiques comparatifs */}
      {compareMode && compareData && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('admin.analytics.comparison')}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  ...conversionData.platformBreakdown.map(item => ({
                    ...item,
                    period: 'Période actuelle'
                  })),
                  ...compareData.platformBreakdown.map(item => ({
                    ...item,
                    period: 'Période précédente'
                  }))
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip
                    formatter={(value, name) => {
                      if (name === 'conversionValue') return formatCurrency(value);
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="conversions"
                    fill="#8884d8"
                    name={t('admin.analytics.conversions')}
                    stackId={0}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="clicks"
                    fill="#82ca9d"
                    name={t('admin.analytics.clicks')}
                    stackId={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Button
        startIcon={<Description />}
        onClick={handleReportDialogOpen}
        variant="outlined"
        size="small"
      >
        {t('admin.analytics.generate_report')}
      </Button>

      {/* Dialog de génération de rapport */}
      <Dialog
        open={reportDialogOpen}
        onClose={handleReportDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{t('admin.analytics.generate_report')}</Typography>
            <Box>
              <Button
                startIcon={<Save />}
                onClick={saveCustomTemplate}
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
              >
                {isEditingTemplate ? t('common.save') : t('common.save_template')}
              </Button>
              <Button
                startIcon={<Add />}
                onClick={() => {
                  setTemplateName('');
                  setIsEditingTemplate(false);
                  setEditingTemplateId(null);
                }}
                variant="outlined"
                size="small"
              >
                {t('common.new_template')}
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={selectedTemplate}
            onChange={(_, value) => handleTemplateChange(value)}
            sx={{ mb: 2 }}
          >
            {Object.values(REPORT_TEMPLATES).map(template => (
              <Tab
                key={template.id}
                value={template.id}
                label={template.name}
                icon={template.id === 'performance' ? <Assessment /> :
                      template.id === 'marketing' ? <Business /> :
                      <Description />}
              />
            ))}
          </Tabs>

          <Typography variant="subtitle1" gutterBottom>
            {REPORT_TEMPLATES[selectedTemplate].description}
          </Typography>

          <List>
            {Object.values(REPORT_SECTIONS).map(section => (
              <ListItem key={section.id} disablePadding>
                <ListItemButton
                  onClick={() => handleSectionToggle(section.id)}
                  selected={selectedSections.includes(section.id)}
                >
                  <Checkbox
                    edge="start"
                    checked={selectedSections.includes(section.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemIcon>{section.icon}</ListItemIcon>
                  <MuiListItemText
                    primary={section.name}
                    secondary={section.description}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('admin.analytics.report_notes')}
            value={reportNotes}
            onChange={(e) => setReportNotes(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            {t('admin.analytics.report_frequency')}
          </Typography>
          <RadioGroup
            value={reportFrequency}
            onChange={(e) => setReportFrequency(e.target.value)}
          >
            <FormControlLabel
              value="once"
              control={<Radio />}
              label={t('admin.analytics.report_once')}
            />
            <FormControlLabel
              value="daily"
              control={<Radio />}
              label={t('admin.analytics.report_daily')}
            />
            <FormControlLabel
              value="weekly"
              control={<Radio />}
              label={t('admin.analytics.report_weekly')}
            />
            <FormControlLabel
              value="monthly"
              control={<Radio />}
              label={t('admin.analytics.report_monthly')}
            />
          </RadioGroup>

          {reportFrequency !== 'once' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('admin.analytics.report_schedule')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label={t('admin.analytics.report_day')}
                    value={reportSchedule.day}
                    onChange={(e) => setReportSchedule(prev => ({
                      ...prev,
                      day: e.target.value
                    }))}
                  >
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => (
                      <MenuItem key={day} value={day}>
                        {t(`common.days.${day}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="time"
                    fullWidth
                    label={t('admin.analytics.report_time')}
                    value={reportSchedule.time}
                    onChange={(e) => setReportSchedule(prev => ({
                      ...prev,
                      time: e.target.value
                    }))}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Options de mise en page */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            {t('admin.analytics.layout_options')}
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            {Object.values(LAYOUT_OPTIONS).map(layout => (
              <Card
                key={layout.id}
                sx={{
                  cursor: 'pointer',
                  border: selectedLayout === layout.id ? '2px solid #1976d2' : '1px solid #ddd'
                }}
                onClick={() => setSelectedLayout(layout.id)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    {layout.icon}
                    <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      {layout.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {layout.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Option pour les graphiques */}
          <FormControlLabel
            control={
              <Switch
                checked={showGraphs}
                onChange={(e) => setShowGraphs(e.target.checked)}
              />
            }
            label={t('admin.analytics.include_graphs')}
          />

          {/* Templates personnalisés */}
          {customTemplates.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                {t('admin.analytics.custom_templates')}
              </Typography>
              <List>
                {customTemplates.map(template => (
                  <ListItem
                    key={template.id}
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          onClick={() => editCustomTemplate(template)}
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => deleteCustomTemplate(template.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={template.name}
                      secondary={`${template.sections.length} sections`}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* Options d'export */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            {t('admin.analytics.export_format')}
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            {Object.values(EXPORT_FORMATS).map(format => (
              <Card
                key={format.id}
                sx={{
                  cursor: 'pointer',
                  border: exportFormat === format.id ? '2px solid #1976d2' : '1px solid #ddd'
                }}
                onClick={() => setExportFormat(format.id)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    {format.icon}
                    <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      {format.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {format.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Options d'export */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('admin.analytics.export_options')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={exportOptions.includeGraphs}
                  onChange={(e) => setExportOptions(prev => ({
                    ...prev,
                    includeGraphs: e.target.checked
                  }))}
                />
              }
              label={t('admin.analytics.include_graphs')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={exportOptions.includeNotes}
                  onChange={(e) => setExportOptions(prev => ({
                    ...prev,
                    includeNotes: e.target.checked
                  }))}
                />
              }
              label={t('admin.analytics.include_notes')}
            />
            {exportFormat === 'excel' && (
              <FormControlLabel
                control={
                  <Switch
                    checked={exportOptions.separateSheets}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      separateSheets: e.target.checked
                    }))}
                  />
                }
                label={t('admin.analytics.separate_sheets')}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReportDialogClose}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleExport}
            variant="contained"
            startIcon={exportFormat === 'pdf' ? <PictureAsPdf /> :
                     exportFormat === 'excel' ? <TableChart /> :
                     <TableRows />}
          >
            {t('admin.analytics.export')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConversionDashboard; 