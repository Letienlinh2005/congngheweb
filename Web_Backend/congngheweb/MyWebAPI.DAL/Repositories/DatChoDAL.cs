using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using System.Data;
using MyWebAPI.DTO;


namespace MyWebAPI.DAL
{
    public interface IDatChoStorage
    {
        Task InsertAsync(DatChoDTO item);                                 
        Task<DatChoDTO?> GetByIdAsync(string maDatCho);                      
        Task<List<DatChoDTO>> ListAsync(string? maBanDoc, string? maSach, string? trangThai); 
        Task<string?> SetReadyAsync(string maSach, int giuTrongGio);         
        Task<int> CancelAsync(string maDatCho);                          
        Task<int> ExpireReadyAsync();                                     
    }

    public class SqlDatChoStorage : IDatChoStorage
    {
        private readonly string _connStr;
        public SqlDatChoStorage(string connStr) => _connStr = connStr;

        public async Task InsertAsync(DatChoDTO item)
        {
            using var con = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_DatCho_Insert", con) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@MaDatCho", item.MaDatCho);
            cmd.Parameters.AddWithValue("@MaSach", item.MaSach);
            cmd.Parameters.AddWithValue("@MaBanDoc", item.MaBanDoc);
            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<DatChoDTO?> GetByIdAsync(string maDatCho)
        {
            using var con = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_DatCho_GetById", con) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@MaDatCho", maDatCho);
            await con.OpenAsync();
            using var rd = await cmd.ExecuteReaderAsync();
            return await rd.ReadAsync() ? Map(rd) : null;
        }

        public async Task<List<DatChoDTO>> ListAsync(string? maBanDoc, string? maSach, string? trangThai)
        {
            using var con = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_DatCho_List", con) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@MaBanDoc", (object?)maBanDoc ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@MaSach", (object?)maSach ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@TrangThai", (object?)trangThai ?? DBNull.Value);

            await con.OpenAsync();
            using var rd = await cmd.ExecuteReaderAsync();
            var list = new List<DatChoDTO>();
            while (await rd.ReadAsync()) list.Add(Map(rd));
            return list;
        }

        public async Task<string?> SetReadyAsync(string maSach, int giuTrongGio)
        {
            using var con = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_DatCho_SetReady", con) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@MaSach", maSach);
            cmd.Parameters.AddWithValue("@GiuTrongGio", giuTrongGio);
            await con.OpenAsync();
            var scalar = await cmd.ExecuteScalarAsync();
            return scalar is string s ? s : null;
        }

        public async Task<int> CancelAsync(string maDatCho)
        {
            using var con = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_DatCho_Cancel", con) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@MaDatCho", maDatCho);
            await con.OpenAsync();
            return await cmd.ExecuteNonQueryAsync();
        }

        public async Task<int> ExpireReadyAsync()
        {
            using var con = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_DatCho_ExpireReady", con) { CommandType = CommandType.StoredProcedure };
            await con.OpenAsync();
            using var rd = await cmd.ExecuteReaderAsync();
            return (await rd.ReadAsync()) ? rd.GetInt32(0) : 0;
        }

        private static DatChoDTO Map(SqlDataReader rd) => new DatChoDTO
        {
            MaDatCho = rd.GetString(rd.GetOrdinal("MaDatCho")),
            MaSach = rd.GetString(rd.GetOrdinal("MaSach")),
            MaBanDoc = rd.GetString(rd.GetOrdinal("MaBanDoc")),
            NgayTao = rd.GetDateTime(rd.GetOrdinal("NgayTao")),
            TrangThai = rd.GetString(rd.GetOrdinal("TrangThai")),
            GiuDen = rd.IsDBNull(rd.GetOrdinal("GiuDen")) ? null : rd.GetDateTime(rd.GetOrdinal("GiuDen"))
        };
    }
}

