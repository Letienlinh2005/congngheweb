function BanDocList({data, onDelete, onEdit}){
    return (
        <div>
            {data.map((bd) =>(
                <div key={bd.maBanDoc}>
                    <b>{bd.hoTen}</b>

                    <button onClick={() => onEdit(bd)}>Sửa</button>
                    <button onClick={() => onDelete(bd.maBanDoc)}>Xóa</button>
                </div>
            ))}
        </div>
    )
}

export default BanDocList