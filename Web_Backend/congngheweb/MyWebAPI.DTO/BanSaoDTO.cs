using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebAPI.DTO
{
    public class BanSaoDTO
    {
        public string MaBanSao { get; set; }
        public string MaVach { get; set; }
        public string? TrangThai { get; set; }
        public string TieuDe { get; set; }
        public string ViTri { get; set; }
    }
    public class CreateBanSaoRequest
    {
        public string MaVach { get; set; }
        public string MaSach { get; set; }
        public string? MaKe { get; set; }

        public string? TrangThai { get; set; }
    }

    public class UpdateBanSaoRequest
    {
        public string MaVach { get; set; }
        public string MaSach { get; set; }
        public string? MaKe { get; set; }

        public string? TrangThai { get; set; }
    }
}
