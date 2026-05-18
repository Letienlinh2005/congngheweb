namespace MyWebAPI.Models
{
    public class SachVM
    {
        public string? MaSach { get; set; }
        public string TenSach { get; set; } = default!;
        public string TacGia { get; set; } = default!;
        public int? NamXuatBan { get; set; }
        public string? TheLoai { get; set; }

        public string? NgonNgu { get; set; }

        public string? TomTat { get; set; }
    }
}
