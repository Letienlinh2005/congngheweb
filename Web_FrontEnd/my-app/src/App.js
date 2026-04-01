import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import AdminLayout from "./layouts/Admin_layouts";
import Dashboard from "./pages/Admin/Dashboard/admin_component";
import ProductList from "./pages/Admin/Product/ProductList";
import PrivateRoute from "./routes/PrivateRoute";
import AccountList from "./pages/Admin/TaiKhoan/AccountList";
import CategoryList from "./pages/Admin/TheLoai/Categories";
import ReaderList from "./pages/Admin/BanDoc/ReaderList";
import ProductListClient from "./pages/Client/Products";
import ClientLayout from "./layouts/Client_layouts";
import BookDetail from "./pages/Client/ProductDetail";

function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
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
        <Route path="accounts" element={<AccountList />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="readers" element={<ReaderList />} />
      </Route>

      {/* CLIENT */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<ProductListClient />} />
        <Route path="books" element={<ProductListClient />} />
        <Route path="books/:id" element={<BookDetail/>}/>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  );
}

export default App;