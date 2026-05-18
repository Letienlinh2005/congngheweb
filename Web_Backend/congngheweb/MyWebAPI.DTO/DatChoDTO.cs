using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyWebAPI.DTO;


namespace MyWebAPI.DTO
{
    public class DatChoDTO
    {
        public string MaDatCho { get; set; } = default!;
        public string MaSach { get; set; } = default!;
        public string MaBanDoc { get; set; } = default!;
        public DateTime NgayTao { get; set; }
        public string TrangThai { get; set; } = default!;
        public DateTime? GiuDen { get; set; }
    }

    public class DatChoCreateRequest
    {
        public string MaSach { get; set; } = default!;
        public string MaBanDoc { get; set; } = default!;
    }

    public class DatChoReadyRequest
    {
        public string MaSach { get; set; } = default!;
        public int GiuTrongGio { get; set; } = 48;
    }
}
