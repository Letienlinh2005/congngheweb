import { useState, useEffect } from "react";
import { getProduct } from "../../../services/Admin_API/SachAPI";
import Product_List from "../Product/ProductList";

function Dashboard(){
    return (
        <Product_List/>
    )
}

export default Dashboard