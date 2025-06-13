import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RepairRequests from "@/pages/RepairRequests";
import CreateRequest from "@/pages/CreateRequest";
import Components from "@/pages/Components";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repair-requests"
            element={
              <ProtectedRoute>
                <RepairRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-request"
            element={
              <ProtectedRoute requiredRole="client">
                <CreateRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/components"
            element={
              <ProtectedRoute requiredRole="technician">
                <Components />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
