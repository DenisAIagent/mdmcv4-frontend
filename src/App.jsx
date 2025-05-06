// src/App.jsx
// ... (imports inchangés en haut) ...
// MODIFIÉ: Importation de apiService, qui contient authService
import apiService from './services/api.service'; // Ajuster le chemin si nécessaire

// ... (autres imports) ...

// === ProtectedRoute ===
const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });
  const location = useLocation(); // Pour la redirection et la clé de re-vérification

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      if (!isMounted) return;
      setAuthStatus(prev => ({ ...prev, isLoading: true }));
      try {
        console.log("ProtectedRoute: Vérification auth via apiService.auth.getMe()...");
        const response = await apiService.auth.getMe(); // Renvoie { success: true, data: user }

        if (isMounted) {
          if (response.success && response.data) {
            console.log("ProtectedRoute: Auth check réussi", response.data);
            setAuthStatus({
              isLoading: false,
              isAuthenticated: true,
              isAdmin: response.data.role === 'admin',
            });
            if (response.data.role !== 'admin') {
              console.warn("ProtectedRoute: Utilisateur authentifié mais PAS admin.");
            }
          } else {
            // Ce cas est moins probable si l'API lance une erreur en cas de non-succès
            console.warn("ProtectedRoute: Auth check a renvoyé success:false ou data manquante.");
            setAuthStatus({ isLoading: false, isAuthenticated: false, isAdmin: false });
          }
        }
      } catch (error) { // L'erreur est déjà structurée par l'intercepteur Axios
        if (isMounted) {
          console.error("ProtectedRoute: Auth check API error:", error.status, error.message);
          setAuthStatus({ isLoading: false, isAuthenticated: false, isAdmin: false });
        }
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, [location.key]); // location.key est une façon simple de re-vérifier si la "page" change

  if (authStatus.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Vérification de l'accès...</Typography>
      </Box>
    );
  }

  if (!authStatus.isAuthenticated || !authStatus.isAdmin) {
    console.log(`ProtectedRoute: Redirection vers /admin (login). Auth: ${authStatus.isAuthenticated}, Admin: ${authStatus.isAdmin}`);
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};
// ... (AdminLayout, HomePage, et le reste de App sont OK, avec les imports de composants corrigés si nécessaire) ...

// Dans la fonction App()
// ...
        <Route path="/admin" element={<AdminLogin />} /> {/* Login Page publique */}

        {/* Routes Admin Protégées */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          {/* Redirige /admin (si protégé et auth) vers /admin/dashboard */}
          {/* Important: la route /admin publique pour AdminLogin est définie séparément */}
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          <Route path="/admin/artists" element={<ArtistListPage />} />
          <Route path="/admin/artists/new" element={<ArtistCreatePage />} />
          <Route path="/admin/artists/edit/:slug" element={<ArtistEditPage />} />
          {/* La route index pour /admin/* n'est pas nécessaire ici car /admin est déjà la page de login.
              Si un utilisateur loggué tente /admin, il est déjà loggué.
              S'il tente /admin/quelquechose, ProtectedRoute le gère.
              Si après login on veut aller à /admin/dashboard, AdminLogin s'en charge.
           */}
           {/* <Route index element={<Navigate to="/admin/dashboard" replace />} />  <-- On peut supprimer ça */}
        </Route>
// ...
export default App;
