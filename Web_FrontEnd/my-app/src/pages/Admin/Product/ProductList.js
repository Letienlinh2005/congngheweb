import { useEffect, useState } from "react"
import { getProduct } from "../../../services/Admin_API/SachAPI"
import ProductCard from "../../../components/ProductCard"
import "../../../App.css"

function ProductList() {

    const [products, setProducts] = useState([])

    useEffect(() => {

        getProduct()
            .then(res => {
                setProducts(res.data.data)
            })

    }, [])

    return (

        <div className="product-grid">
            {products.map((book) =>(
                <ProductCard key={book.maSach} book={book}/>
            ))}
        </div>

    )

}

export default ProductList