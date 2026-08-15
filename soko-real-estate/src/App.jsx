import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Properties from "./pages/properties";
import PropertyDetails from "./pages/propertydetails";
import UploadProperty from "./pages/uploadproperty";
import MyProperties from "./pages/myproperties";
import EditProperty from "./pages/editproperty";
import AdminDashboard from "./pages/admindashboard";
import AdminAnalytics from "./pages/adminanalytics";
import MapView from "./pages/mapview";
import Login from "./pages/login";
import Register from "./pages/register";
import VerifyEmail from "./pages/verifyemail";
import ResendVerification from "./pages/resendverification";
import Contact from "./pages/contact";
import ForgotPassword from "./pages/forgotpassword";
import ResetPassword from "./pages/resetpassword";

import ProtectedRoute from "./components/protectedroute";
import AdminRoute from "./components/adminroute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/map" element={<MapView />} />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-properties"
          element={
            <ProtectedRoute>
              <MyProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-property/:id"
          element={
            <ProtectedRoute>
              <EditProperty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;