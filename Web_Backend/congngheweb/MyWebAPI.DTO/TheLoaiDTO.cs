

namespace MyWebAPI.DTO
{
    public class TheLoaiDTO
    {
        public string MaTheLoai { get; set; } = null!;
        public string TenTheLoai { get; set; } = null!;
    }

    public class CreateTheLoaiRequest
    {
        public string? MaTheLoai { get; set; }
        public string TenTheLoai { get; set; } = null!;

    }
    public class UpdateTheLoaiRequest
    {
        public string TenTheLoai { get; set; } = null!;
    }

}
