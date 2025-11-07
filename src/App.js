import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainHub from "./MainHub";

import Design from "./pages/design.jsx";
import Development from "./pages/developement.jsx";
import Communication from "./pages/Communication.jsx";
import HumanResources from "./pages/HumanResources.jsx";
import Logistics from "./pages/Logistics.jsx";
import Multimedia from "./pages/UIUX.jsx";
import ExternalRelations from "./pages/ER.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main layout */}
        <Route path="/" element={<MainHub />}>
          {/* MainHub home (no redirect to design) */}
          <Route index element={null} />

          {/* Departments - paths are RELATIVE to "/" */}
          <Route path="design" element={<Design />} />
          <Route path="development" element={<Development />} />
          <Route path="communication" element={<Communication />} />
          <Route path="human-resources" element={<HumanResources />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="multimedia" element={<Multimedia />} />
          <Route path="external-relations" element={<ExternalRelations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
