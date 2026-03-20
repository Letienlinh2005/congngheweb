import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import ProductList from "./pages/Admin/Product/ProductList";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./PrivateRoute";
import AccountList from "../pages/Admin/TaiKhoan/AccountList";
import CategoryList from "../pages/Admin/TheLoai/Categories";
import ReaderList from "../pages/Admin/BanDoc/ReaderList";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN (có bảo vệ) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="accounts" element={<AccountList/>} />
          <Route path="categories" element={<CategoryList/>} />
          <Route path="readers" element={<ReaderList/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;