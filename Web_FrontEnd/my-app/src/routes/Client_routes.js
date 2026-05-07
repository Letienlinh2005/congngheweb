import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProductList from "../pages/Client/Products";

function AppClient() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/home" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppClient