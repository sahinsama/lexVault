import { Routes, Route } from "react-router-dom";
import "./app.css";
import Home from "./pages/home.jsx";
import Vault from "./pages/vault.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<Vault />} />
    </Routes>
  );
}

export default App;