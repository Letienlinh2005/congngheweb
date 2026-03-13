import { Link } from "react-router-dom"

function Sidebar(){

  return(

    <div style={{width:"200px",background:"#eee",padding:"20px"}}>

        <h3>Admin</h3>

        <ul>

          <li>
            <Link to="/admin">Dashboard</Link>
          </li>

          <li>
            <Link to="/admin/products">Products</Link>
          </li>

        </ul>

    </div>

  )

}

export default Sidebar