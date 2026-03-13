import { useEffect, useState } from "react"
import { getBanDocs, createBanDoc, deleteBanDoc } from "../../../services/Admin_API/banDocAPI"
import BanDocList from "./BanDocList"
import BanDocForm from "./BanDocForm"

function BanDocPage() {

  const [data, setData] = useState([])

  const loadData = async () => {
    const res = await getBanDocs()
    setData(res.data.data)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async (form) => {
    await createBanDoc(form)
    loadData()
  }

  const handleDelete = async (id) => {
    await deleteBanDoc(id)
    loadData()
  }

  return (
    <div>
      <h1>Quản lý bạn đọc</h1>

      <BanDocForm onSubmit={handleCreate} />

      <BanDocList
        data={data}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default BanDocPage