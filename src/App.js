import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainHub from "./MainHub";

import Design from "./pages/design.jsx";
import Developpent from "./pages/developement.jsx";
import Communication from "./pages/Communication.jsx";
import HumanResources from "./pages/HumanResources.jsx";
import Logistics from "./pages/Logistics.jsx";
import Multimedia from "./pages/UIUX.jsx";
import ExternalRelations from "./pages/ER.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainHub />}>
          <Route index element={<Navigate to="/design" replace />} />
          <Route path="/design" element={<Design />} />
          <Route path="/developpent" element={<Developpent />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/human-ressources" element={<HumanResources />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/multimedia" element={<Multimedia />} />
          <Route path="/external-relations" element={<ExternalRelations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
