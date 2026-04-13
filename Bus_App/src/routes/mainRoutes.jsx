import React from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import UploaderSignUpPage from "../pages/UploaderSignUpPage";
import AddBus from "../pages/AddBus";
import BusList from "../pages/BusList";
import SeatBookingPage from "../pages/SeatBookingPage";
import SearchResults from "../pages/SearchResults";
import MyBookings from "../pages/MyBookings";
import TicketPage from "../pages/TicketPage";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

const mainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "signup",
      element: <SignUpPage />,
    },
    {
      path: "uploader-signup",
      element: <UploaderSignUpPage />,
    },
    
    // --- USER ROUTES ---
    {
      path: "dashboard",
      element: (
        <ProtectedRoute allowedRoles={["user", "busUploader"]}>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "my-bookings",
      element: (
        <ProtectedRoute allowedRoles={["user"]}>
          <MyBookings />
        </ProtectedRoute>
      ),
    },
    {
      path: "search-results",
      element: (
        <ProtectedRoute allowedRoles={["user"]}>
          <SearchResults />
        </ProtectedRoute>
      ),
    },
    {
      path: "seat-booking",
      element: (
        <ProtectedRoute allowedRoles={["user"]}>
          <SeatBookingPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "ticket/:bookingId",
      element: (
        <ProtectedRoute allowedRoles={["user"]}>
          <TicketPage />
        </ProtectedRoute>
      ),
    },

    // --- UPLOADER ROUTES ---
    {
      path: "uploader/dashboard",
      element: (
        <ProtectedRoute allowedRoles={["busUploader"]}>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "uploader/add-bus",
      element: (
        <ProtectedRoute allowedRoles={["busUploader"]}>
          <AddBus />
        </ProtectedRoute>
      ),
    },
    {
      path: "uploader/buses",
      element: (
        <ProtectedRoute allowedRoles={["busUploader"]}>
          <BusList />
        </ProtectedRoute>
      ),
    },

    // --- REDIRECTS & FALLBACKS ---
    {
      path: "uploader",
      element: <Navigate to="/uploader/dashboard" replace />,
    },
    {
      path: "add-bus",
      element: <Navigate to="/uploader/add-bus" replace />,
    },
    {
      path: "buses",
      element: <Navigate to="/uploader/buses" replace />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
};

export default mainRoutes;
