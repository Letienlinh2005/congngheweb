using System;

namespace MyWebAPI.DTO
{
    public class TonKhoTheoTheLoaiDTO
    {
        public string MaTheLoai { get; set; } = "";
        public string TenTheLoai { get; set; } = "";
        public int SoTuaSach { get; set; }
        public int TongSoBan { get; set; }
        public int ConTrongKho { get; set; }
        public int DangMuon { get; set; }
        public int HuHong { get; set; }

        public decimal TongTienPhat { get; set; }   
    }


    public class TonKhoTheoSachDTO
    {
        public string MaSach { get; set; } = "";
        public string TenSach { get; set; } = "";
        public string TenTheLoai { get; set; } = "";
        public int TongSoBan { get; set; }
        public int ConTrongKho { get; set; }
        public int DangMuon { get; set; }
        public int HuHong { get; set; }

        public decimal TongTienPhat { get; set; }   
    }

}
