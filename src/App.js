import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Premium from "./pages/Premium";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/premium" element={<Premium />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;