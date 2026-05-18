using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebAPI.DTO
{
    public class ThanhToanDuNoDTO
    {
        public string MaThanhToan { get; set; }
        public string MaBanDoc { get; set; }
        public decimal SoTien { get; set; }
        public string HinhThuc { get; set; }
        public string? GhiChu { get; set; }
    }
}
