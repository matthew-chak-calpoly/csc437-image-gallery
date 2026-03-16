import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./MainLayout.jsx";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { VALID_ROUTES } from "../../shared/ValidRoutes.js";
import React, { useState } from "react";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

function App() {
  const [authToken, setAuthToken] = useState(undefined);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={VALID_ROUTES.HOME} element={<ProtectedRoute authToken={authToken}><AllImages authToken={authToken}/></ProtectedRoute>} />
        <Route path={VALID_ROUTES.IMAGES} element={<ProtectedRoute authToken={authToken}><ImageDetails authToken={authToken}/></ProtectedRoute>} />
        <Route path={VALID_ROUTES.UPLOAD} element={<ProtectedRoute authToken={authToken}><UploadPage /></ProtectedRoute>} />
        <Route path={VALID_ROUTES.LOGIN} element={<LoginPage onAuthenticated={setAuthToken} />} />
        <Route path={VALID_ROUTES.REGISTER} element={<LoginPage isRegistering={true} onAuthenticated={setAuthToken} />} />
      </Route>
    </Routes>
  );
}

export default App;