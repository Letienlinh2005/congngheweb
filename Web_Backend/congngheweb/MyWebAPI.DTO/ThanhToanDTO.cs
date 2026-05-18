using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebAPI.DTO
{
    public class ThanhToanDTO
    {
        public string? MaThanhToan { get; set; }  
        public string MaBanDoc { get; set; } = default!;
        public DateTime NgayThanhToan { get; set; }  
        public decimal SoTien { get; set; }         
        public string HinhThuc { get; set; } = default!; 
        public string? GhiChu { get; set; }          
    }
    public class ThanhToanPhatDTO
    {
        public string MaPhat { get; set; } = default!;
        public string MaThanhToan { get; set; } = default!;
        public string HinhThuc { get; set; } = default!;
        public string? GhiChu { get; set; }
    }

}
