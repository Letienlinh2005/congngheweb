function ProductCard({book}){

  return(

    <div className="product-card">

        <img src={book.anhBiaUrl} alt={book.tieuDe}/>

        <h3>{book.tieuDe}</h3>

        <p><b>Tác giả:</b> {book.tacGia}</p>

        <p><b>Năm:</b> {book.namXuatBan}</p>

        <p><b>Thể loại:</b> {book.theLoai}</p>

        <p><b>Ngôn ngữ:</b> {book.ngonNgu}</p>

    </div>

  )

}

export default ProductCard