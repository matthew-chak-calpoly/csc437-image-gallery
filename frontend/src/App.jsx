import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./MainLayout.jsx";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { VALID_ROUTES } from "../../shared/ValidRoutes.js";
import React from "react";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { AuthProvider } from "./AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path={VALID_ROUTES.HOME}
            element={
              <ProtectedRoute>
                <AllImages />
              </ProtectedRoute>
            }
          />
          <Route
            path={VALID_ROUTES.IMAGES}
            element={
              <ProtectedRoute>
                <ImageDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path={VALID_ROUTES.UPLOAD}
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route path={VALID_ROUTES.LOGIN} element={<LoginPage />} />
          <Route
            path={VALID_ROUTES.REGISTER}
            element={<LoginPage isRegistering={true} />}
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;