import { Routes, Route } from "react-router-dom";
import "./app.css";
import Home from "./pages/home.jsx";
import Vault from "./pages/vault.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<home />} />
      <Route path="/app" element={<vault />} />
    </Routes>
  );
}

export default App;