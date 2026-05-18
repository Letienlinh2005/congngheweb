using Microsoft.Data.SqlClient;
using System.Data;
using MyWebAPI.DTO;

namespace MyWebAPI.DAL.Repositories
{
    public interface ITheLoaiRepository
    {
        Task<List<TheLoaiDTO>> GetAllAsync();
        Task<TheLoaiDTO?> GetByIdAsync(string maTheLoai);
        Task<bool> CreateAsync(TheLoaiDTO theLoai);
        Task<bool> UpdateAsync(string maTheLoai, TheLoaiDTO theLoai);
        Task<bool> DeleteAsync(string maTheLoai);
    }
    public class TheLoaiRepository : ITheLoaiRepository
    {
        private readonly string _connStr;
        public TheLoaiRepository(string connectionString)
        {
            _connStr = connectionString;
        }

        public async Task<List<TheLoaiDTO>> GetAllAsync()
        {
            var list = new List<TheLoaiDTO>();
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetAllTheLoai", con);
            cmd.CommandType = CommandType.StoredProcedure;
            using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
            {
                list.Add(new TheLoaiDTO
                {
                    MaTheLoai = rd.GetString(0),
                    TenTheLoai = rd.GetString(1)
                });
            }
            return list;
        }
        public async Task<TheLoaiDTO?> GetByIdAsync(string maTheLoai)
        {
            TheLoaiDTO? theLoai = null;
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetTheLoaiById", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaTheLoai", maTheLoai);
            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                theLoai = new TheLoaiDTO
                {
                    MaTheLoai = rd.GetString(0),
                    TenTheLoai = rd.GetString(1)
                };
            }
            return theLoai;
        }
        public async Task<bool> CreateAsync(TheLoaiDTO theLoai)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_InsertTheLoai", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaTheLoai", theLoai.MaTheLoai);
            cmd.Parameters.AddWithValue("@TenTheLoai", theLoai.TenTheLoai);
            var rowsAffected = await cmd.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }
        public async Task<bool> UpdateAsync(string maTheLoai, TheLoaiDTO theLoai)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_UpdateTheLoai", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaTheLoai", maTheLoai);
            cmd.Parameters.AddWithValue("@TenTheLoai", theLoai.TenTheLoai);
            var rowsAffected = await cmd.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }
        public async Task<bool> DeleteAsync(string maTheLoai)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_DeleteTheLoai", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaTheLoai", maTheLoai);
            var rowsAffected = await cmd.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

    }
}
