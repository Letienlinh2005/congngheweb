using Microsoft.Data.SqlClient;
using MyWebAPI.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyWebAPI.DAL.Repositories
{
    public interface IKeSachRepository
    {
        Task<List<KeSachDTO>> GetAllAsync();
        Task<KeSachDTO?> GetByIdAsync(string maKe);
        Task<string> CreateAsync(CreateKeSachRequest keSach);
        Task<int> UpdateAsync(string maKe, UpdateKeSachRequest keSach);
        Task<int> DeleteAsync(string maKe);
    }

    public class KeSachRepository : IKeSachRepository
    {
        private readonly string _connStr;

        public KeSachRepository(string connectionString)
        {
            _connStr = connectionString;
        }

        public async Task<List<KeSachDTO>> GetAllAsync()
        {
            var list = new List<KeSachDTO>();
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetAllKeSach", con);
            cmd.CommandType = CommandType.StoredProcedure;

            using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
            {
                list.Add(new KeSachDTO
                {
                    maKe = rd.GetString(0),
                    viTri = rd.GetString(1)
                });
            }
            return list;
        }

        public async Task<KeSachDTO?> GetByIdAsync(string maKe)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetKeSachById", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaKe", maKe);

            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                return new KeSachDTO
                {
                    maKe = rd.GetString(0),
                    viTri = rd.GetString(1)
                };
            }
            return null;
        }

        public async Task<string> CreateAsync(CreateKeSachRequest keSach)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_CreateKeSach", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@ViTri", keSach.viTri);

            var result = await cmd.ExecuteScalarAsync();
            return result?.ToString(); 
        }

        public async Task<int> UpdateAsync(string maKe, UpdateKeSachRequest keSach)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_UpdateKeSach", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaKe", maKe);
            cmd.Parameters.AddWithValue("@ViTri", keSach.viTri);
            

            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<int> DeleteAsync(string maKe)
        {
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_DeleteKeSach", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaKe", maKe);

            return await cmd.ExecuteNonQueryAsync();
        }
    }
}
