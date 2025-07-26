import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import { FavoriteProvider } from "./context/FavoritesContext";


const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoriteProvider>
          <Router>
              <AppRoutes />
          </Router>
        </FavoriteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;