import { BrowserRouter, Routes, Route } from "react-router-dom"

import AdminLayout from "./layouts/AdminLayout"
import Dashboard from "./pages/Admin/Dashboard"
import ProductList from "./pages/Admin/Product/ProductList"

function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/admin" element={<AdminLayout/>}>

            <Route index element={<Dashboard/>}/>

            <Route path="products" element={<ProductList/>}/>

        </Route>

      </Routes>

    </BrowserRouter>

  )

}

export default App