using Azure.Core;
using Microsoft.Data.SqlClient;
using MyWebAPI.DTO;
using System.Data;

namespace MyWebAPI.DAL.Repositories
{
    public interface IBanSaoRepository
    {
        Task<List<BanSaoDTO>> GetAllAsync();
        Task<BanSaoDTO> GetByIdAsync(string maBanSao);
        Task<int> CreateAsync(CreateBanSaoRequest banSao, string maBanSao);
        Task<int> UpdateAsync(string maBanSao, UpdateBanSaoRequest banSao);
        Task<int> DeleteAsync(string maBanSao);
        Task<List<BanSaoDTO>> GetByMaSachAsync(string maSach);
    }
    public class BanSaoRepository : IBanSaoRepository
    {
        private readonly string _connStr;
        public BanSaoRepository(string connectionString)
        {
            _connStr = connectionString;

        }

        public async Task<List<BanSaoDTO>> GetAllAsync()
        {
            var list = new List<BanSaoDTO>();
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetAllBanSao", con);
            cmd.CommandType = CommandType.StoredProcedure;
            using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
            {
                list.Add(new BanSaoDTO
                {
                    MaBanSao = rd.GetString(0),
                    MaVach = rd.GetString(1),
                    TieuDe = rd.GetString(2),
                    ViTri = rd.GetString(3),
                    TrangThai = rd.GetString(4)
                });
            }
            return list;
        }
        public async Task<BanSaoDTO> GetByIdAsync(string maBanSao)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetBanSaoById", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaBanSao", maBanSao);
            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                return new BanSaoDTO
                {
                    MaBanSao = rd.GetString(0),
                    MaVach = rd.GetString(1),
                    TieuDe = rd.GetString(2),
                    ViTri = rd.GetString(3),
                    TrangThai = rd.GetString(4)
                };
            }
            return null;
        }
        public async Task<int> CreateAsync(CreateBanSaoRequest banSao, string maBanSao)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_InsertBanSao", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaBanSao", maBanSao);
            cmd.Parameters.AddWithValue("@MaVach", banSao.MaVach);
            cmd.Parameters.AddWithValue("@MaSach", banSao.MaSach);
            cmd.Parameters.Add(new SqlParameter("@MaKe", SqlDbType.NVarChar, 20) { Value = (object?)banSao.MaKe ?? DBNull.Value });
            cmd.Parameters.Add(new SqlParameter("@TrangThai", SqlDbType.NVarChar, 20) { Value = (object?)banSao.TrangThai ?? DBNull.Value });
            return await cmd.ExecuteNonQueryAsync();
        }
        public async Task<int> UpdateAsync(string maBanSao, UpdateBanSaoRequest banSao)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_UpdateBanSao", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaBanSao", maBanSao);
            cmd.Parameters.AddWithValue("@MaVach", banSao.MaVach);
            cmd.Parameters.AddWithValue("@MaSach", banSao.MaSach);
            cmd.Parameters.Add(new SqlParameter("@MaKe", SqlDbType.NVarChar, 20) { Value = (object?)banSao.MaKe ?? DBNull.Value });
            cmd.Parameters.Add(new SqlParameter("@TrangThai", SqlDbType.NVarChar, 20) { Value = (object?)banSao.TrangThai ?? DBNull.Value });
            return await cmd.ExecuteNonQueryAsync();
        }
        public async Task<int> DeleteAsync(string maBanSao)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_DeleteBanSao", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(new SqlParameter("@MaBanSao", SqlDbType.NVarChar, 20) { Value = maBanSao });
            return await cmd.ExecuteNonQueryAsync();
        }
        public async Task<List<BanSaoDTO>> GetByMaSachAsync(string maSach)
        {
            var list = new List<BanSaoDTO>();
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();

            using var cmd = new SqlCommand("sp_GetBanSaoByMaSach", con)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@MaSach", maSach);

            using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
            {
                list.Add(new BanSaoDTO
                {
                    MaBanSao = rd.GetString(0),
                    MaVach = rd.GetString(1),
                    TieuDe = rd.GetString(2),
                    ViTri = rd.GetString(3),
                    TrangThai = rd.GetString(4)
                });
            }

            return list;
        }
    }
}
