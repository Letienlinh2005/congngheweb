import React from 'react';
import { useState, useEffect } from 'react';
import { Card, Row, Col } from "antd";
import { getSachs } from '../../services/Admin_API/SachAPI';
import { useNavigate } from 'react-router-dom';
import '../../css/Products.css';
const { Meta } = Card;

const ProductListClient = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    
    const fetchProducts = async () => {
        try {
            const res = await getSachs();

            const mapped = res.data.data.map((item, index) => ({
                key: item.maSach || index,
                tenSanPham: item.tieuDe,
                tacGia: item.tacGia,
                namXuatBan: item.namXuatBan,
                theLoai: item.maTheLoai,
                anhBiaUrl: item.anhBiaUrl,
            }));

            setData(mapped);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (<Row gutter={[16, 16]}>
        {data.map((item) => (
            <Col key={item.key}>
                <Card
                    hoverable
                    className="products-card"
                    onClick={() => navigate(`/books/${item.key}`)}
                    cover={
                        <img
                            draggable={false}
                            alt={item.tenSanPham}
                            src={item.anhBiaUrl}
                            className="products-card-cover"
                        />
                    }
                >
                    <Meta
                        title={item.tenSanPham}
                        description={item.tacGia}
                    />
                </Card>
            </Col>
        ))}
    </Row>
    );
}


export default ProductListClient;