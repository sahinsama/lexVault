import { Routes, Route } from "react-router-dom";
import "./app.css";
import { AuthProvider } from "./context/authcontext.jsx";
import ProtectedRoute from "./components/protectedroute.jsx";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import ResetPassword from "./pages/resetpassword.jsx";
import CompleteProfile from "./pages/completeprofile.jsx";
import Vault from "./pages/vault.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Vault />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;