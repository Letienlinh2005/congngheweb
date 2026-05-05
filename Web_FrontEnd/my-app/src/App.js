import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import AdminLayout from "./layouts/Admin_layouts";
import Dashboard from "./pages/Admin/admin_component";
import ProductList from "./pages/Admin/ProductList";
import PrivateRoute from "./routes/PrivateRoute";
import AccountList from "./pages/Admin/AccountList";
import CategoryList from "./pages/Admin/Categories";
import ReaderList from "./pages/Admin/ReaderList";
import ProductListClient from "./pages/Client/Products";
import ClientLayout from "./layouts/Client_layouts";
import BookDetail from "./pages/Client/ProductDetail";
import PhieuMuonList from "./pages/Admin/PhieuMuon";
import PhatList from "./pages/Admin/Phat";
import KeSachList from "./pages/Admin/KeSach";
import BanSaoList from "./pages/Admin/BanSao";
import AboutPage from "./pages/Client/About";
import ContactPage from "./pages/Client/Contact";
import ProfilePage from "./pages/Client/Profile";
import BorrowHistoryPage from "./pages/Client/BorrowHistory";
import ThongKeThuvien from "./pages/Admin/admin_component";
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
        <Route index element={<ThongKeThuvien />} />
        <Route path="products" element={<ProductList />} />
        <Route path="accounts" element={<AccountList />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="readers" element={<ReaderList />} />
        <Route path="phieumuon" element={<PhieuMuonList />} />
        <Route path="phat" element={<PhatList />} />
        <Route path="kesach" element={<KeSachList />} />
        <Route path="bansao" element={<BanSaoList />} />
      </Route>

      {/* CLIENT */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<ProductListClient />} />
        <Route path="books" element={<ProductListClient />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="history" element={<BorrowHistoryPage />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  );
}

export default App;