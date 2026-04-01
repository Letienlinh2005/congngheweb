import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col, Tag, Spin } from "antd";
import { getSachById, getSachs } from "../../services/Admin_API/SachAPI";
import "../../css/ProductDetail.css"


function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null)


    const fetchBook = async () => {
        try {
            const res = await getSachById(id);
            setBook(res.data.data)
        }
        catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        fetchBook();
    }, [id]);

    if (!book) return <Spin />

    const handleBorrow = async() => {
        try{
            await console.log("hello")
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="product-detail">
            <div className="container">
                <div className="left">
                    <img src={book.anhBiaUrl} alt={book.tieuDe} />
                </div>
                <div className="right">
                    <h1>{book.tieuDe}</h1>
                    <p><b>Tác giả: </b>{book.tacGia}</p>
                    <p><b>Năm xuất bản: </b>{book.namXuatBan}</p>
                    <p><b>Thể loại </b>{book.theLoai}</p>
                    <p><b>Tóm tắt: </b>{book.tomTat || "Chưa có tóm tắt cho cuốn sách này."}</p>

                    <button className="btn" onClick={() => handleBorrow()}>Mượn sách</button>
                </div>

                
            </div>
        </div>
    )
}

export default BookDetail