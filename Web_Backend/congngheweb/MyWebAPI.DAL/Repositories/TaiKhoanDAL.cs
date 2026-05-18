using Microsoft.Data.SqlClient;
using System.Data;
using MyWebAPI.DTO;

namespace MyWebAPI.DAL.Repositories
{
    public interface ITaiKhoanRepository
    {
        Task<List<TaiKhoanDTO>> GetAllAsync();
        Task<TaiKhoanDTO?> GetByIdAsync(string maTaiKhoan);
        Task<int> CreateAsync(CreateTaiKhoanRequest taiKhoan, string maTaiKhoan, string hashedPassword);
        Task<int> UpdateAsync(string maTaiKhoan, UpdateTaiKhoanRequest taiKhoan, string hashedPassword);
        Task<int> DeleteAsync(string maTaiKhoan);
        Task<TaiKhoanDTO?> GetByTenDangNhapAsync(string tenDangNhap);

        Task<TaiKhoanDTO?> RegisterReaderAsync(string hoTen, string email, string dienThoai, string matKhauHash);

    }

    public class TaiKhoanRepository : ITaiKhoanRepository
    {
        private readonly string _connStr;

        public TaiKhoanRepository(string connectionString)
        {
            _connStr = connectionString;
        }

        public async Task<List<TaiKhoanDTO>> GetAllAsync()
        {
            var list = new List<TaiKhoanDTO>();
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetAllTaiKhoan", con);
            cmd.CommandType = CommandType.StoredProcedure;

            using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
            {
                var dto = new TaiKhoanDTO
                {
                    MaTaiKhoan = rd.GetString(0),
                    TenDangNhap = rd.GetString(1),
                    MatKhau = rd.GetString(2),
                    VaiTro = rd.GetString(3)
                };

                // Nếu SP có trả thêm cột MaBanDoc thì đọc, còn không thì bỏ qua
                if (rd.FieldCount > 4)
                {
                    if (!rd.IsDBNull(4))
                        dto.MaBanDoc = rd.GetString(4);
                }

                list.Add(dto);
            }

            return list;
        }

        public async Task<TaiKhoanDTO?> GetByIdAsync(string maTaiKhoan)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetTaiKhoanById", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);

            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                var dto = new TaiKhoanDTO
                {
                    MaTaiKhoan = rd.GetString(0),
                    TenDangNhap = rd.GetString(1),
                    MatKhau = rd.GetString(2),
                    VaiTro = rd.GetString(3),
                    MaBanDoc = rd.GetString(4)
                };

                if (rd.FieldCount > 4 && !rd.IsDBNull(4))
                {
                    dto.MaBanDoc = rd.GetString(4);
                }

                return dto;
            }
            return null;

        }

        public async Task<int> CreateAsync(CreateTaiKhoanRequest taiKhoan, string maTaiKhoan, string hashedPassword)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_Register", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);
            cmd.Parameters.AddWithValue("@TenDangNhap", taiKhoan.TenDangNhap);
            cmd.Parameters.AddWithValue("@MatKhau", hashedPassword);
            cmd.Parameters.AddWithValue("@VaiTro", taiKhoan.VaiTro);
            cmd.Parameters.AddWithValue("@MaBanDoc", (object?)taiKhoan.MaBanDoc ?? DBNull.Value);

            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<int> UpdateAsync(string maTaiKhoan, UpdateTaiKhoanRequest taiKhoan, string hashedPassword)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_UpdateTaiKhoan", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);
            cmd.Parameters.AddWithValue("@TenDangNhap", taiKhoan.TenDangNhap);
            cmd.Parameters.AddWithValue("@MatKhau", hashedPassword);
            cmd.Parameters.AddWithValue("@VaiTro", taiKhoan.VaiTro);
            cmd.Parameters.AddWithValue("@MaBanDoc", (object?)taiKhoan.MaBanDoc ?? DBNull.Value);

            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<int> DeleteAsync(string maTaiKhoan)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_DeleteTaiKhoan", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);

            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<TaiKhoanDTO?> GetByTenDangNhapAsync(string tenDangNhap)
        {
            using var conn = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_Login", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TenDangNhap", tenDangNhap);

            await conn.OpenAsync();
            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                return new TaiKhoanDTO
                {
                    MaTaiKhoan = rd["MaTaiKhoan"].ToString() ?? "",
                    TenDangNhap = rd["TenDangNhap"].ToString() ?? "",
                    VaiTro = rd["VaiTro"].ToString() ?? "",
                    MatKhau = rd["MatKhau"].ToString() ?? "",
                    MaBanDoc = rd["MaBanDoc"].ToString()
                };
            }
            return null;
        }
        public async Task<TaiKhoanDTO?> RegisterReaderAsync(string hoTen, string email, string dienThoai, string matKhauHash)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();

            using var cmd = new SqlCommand("sp_RegisterReader", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@HoTen", hoTen);
            cmd.Parameters.AddWithValue("@Email", email);
            cmd.Parameters.AddWithValue("@DienThoai", dienThoai);
            cmd.Parameters.AddWithValue("@MatKhau", matKhauHash);

            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                return new TaiKhoanDTO
                {
                    MaTaiKhoan = rd["MaTaiKhoan"].ToString() ?? "",
                    TenDangNhap = rd["TenDangNhap"].ToString() ?? "",
                    VaiTro = "Bạn đọc",
                    MaBanDoc = rd["MaBanDoc"].ToString() ?? ""
                };
            }
            return null;
        }

    }
}