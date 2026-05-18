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
    public interface IThanhToanRepository
    {
        Task<List<ThanhToanDTO>> GetAllAsync();
        Task<ThanhToanDTO> GetByIdAsync(string maThanhToan);
        Task<bool> ThanhToanPhatAsync(ThanhToanPhatDTO request);
    }
    public class ThanhToanRepository : IThanhToanRepository
    {
        private readonly string _connStr;

        public ThanhToanRepository(string connectionString)
        {
            _connStr = connectionString;
        }

        public async Task<List<ThanhToanDTO>> GetAllAsync()
        {
            var list = new List<ThanhToanDTO>();
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetAllThanhToan", con)
            {
                CommandType = CommandType.StoredProcedure
            };
            using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
            {
                list.Add(new ThanhToanDTO
                {
                    MaThanhToan = rd.GetString(0),
                    MaBanDoc = rd.GetString(1),
                    NgayThanhToan = rd.GetDateTime(2),
                    SoTien = rd.GetDecimal(3),
                    HinhThuc = rd.GetString(4),
                    GhiChu = rd.IsDBNull(5) ? null : rd.GetString(5)
                });
            }
            return list;
        }

        public async Task<ThanhToanDTO> GetByIdAsync(string maThanhToan)
        {
            ThanhToanDTO? thanhtoan = null;
            using var con = new SqlConnection(_connStr);
            await con.OpenAsync();
            using var cmd = new SqlCommand("sp_GetThanhToanById", con)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@MaThanhToan", maThanhToan);
            using var rd = await cmd.ExecuteReaderAsync();
            if (await rd.ReadAsync())
            {
                thanhtoan = new ThanhToanDTO
                {
                    MaThanhToan = rd.GetString(0),
                    MaBanDoc = rd.GetString(1),
                    NgayThanhToan = rd.GetDateTime(2),
                    SoTien = rd.GetDecimal(3),
                    HinhThuc = rd.GetString(4),
                    GhiChu = rd.IsDBNull(5) ? null : rd.GetString(5)
                };
            }
            return thanhtoan;
        }

        public async Task<bool> ThanhToanPhatAsync(ThanhToanPhatDTO request)
        {
            using var con = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_ThanhToanPhat", con)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@MaPhat", request.MaPhat);
            cmd.Parameters.AddWithValue("@MaThanhToan", request.MaThanhToan);
            cmd.Parameters.AddWithValue("@HinhThuc", request.HinhThuc);
            cmd.Parameters.AddWithValue("@GhiChu", (object?)request.GhiChu ?? DBNull.Value);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
            return true;
        }
    }
}
