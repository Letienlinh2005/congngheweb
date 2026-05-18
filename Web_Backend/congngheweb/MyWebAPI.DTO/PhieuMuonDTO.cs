using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebAPI.DTO
{
    public class PhieuMuonDTO
    {
        public string MaPhieuMuon { get; set; }
        public string MaBanSao { get; set; }
        public string MaBanDoc { get; set; }
        public DateTime NgayMuon { get; set; }

        public DateTime HanTra { get; set; }
        public DateTime? NgayTraThucTe { get; set; }

        public int SoLanGiaHan { get; set; }

        public string TrangThai { get; set; }
        public string TieuDe { get; set; }

    }

    public class CreatePhieuMuonRequest
    {
        public string MaBanSao { get; set; }
        public string MaBanDoc { get; set; }
        public DateTime NgayMuon { get; set; }
        public DateTime HanTra { get; set; }
    }

    public class UpdatePhieuMuonRequest
    {
        public string MaBanSao { get; set; }
        public string MaBanDoc { get; set; }
        public DateTime NgayMuon { get; set; }
        public DateTime HanTra { get; set; }
        public DateTime? NgayTraThucTe { get; set; }
        public int SoLanGiaHan { get; set; }
        public string TrangThai { get; set; }
    }

    public class GiaHanRequest
    {
        public string MaPhieuMuon { get; set; }
    }

    public class DatChoRequest
    {
        public string MaSach { get; set; }
        public string MaBanDoc { get; set; }
    }

    public class TraSachVaTinhPhatRequest
    {
        public string MaPhieuMuon { get; set; } = default!;
        public DateTime NgayTraThucTe { get; set; }
    }

    public class TraSachVaTinhPhatResultDTO
    {
        public PhieuMuonDTO? PhieuMuon { get; set; }
        public int SoNgayTre { get; set; }
        public decimal TienPhat { get; set; }
        public string? MaPhat { get; set; }   // null nếu không bị phạt
    }

    public class ChiTietPhieuMuonDTO
    {
        public string MaPhieuMuon { get; set; }
        public DateTime NgayMuon { get; set; }
        public string HoTen { get; set; }
        public string TieuDe { get; set; }
        public DateTime HanTra { get; set; }
        public DateTime? NgayTraThucTe { get; set; }
        public int SoLanGiaHan { get; set; }
        public string TrangThai { get; set; }
    }
}