using Microsoft.Data.SqlClient;
using MyWebAPI.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;


namespace MyWebAPI.DAL.Repositories
{
    public interface ITonKhoRepository
    {
        Task<List<TonKhoTheoTheLoaiDTO>> GetTonKhoTheoTheLoaiAsync();
        Task<List<TonKhoTheoSachDTO>> GetTonKhoTheoSachAsync();
    }

    public class TonKhoRepository : ITonKhoRepository
    {
        private readonly string _connStr;

        public TonKhoRepository(string connStr)
        {
            _connStr = connStr;
        }

        public async Task<List<TonKhoTheoTheLoaiDTO>> GetTonKhoTheoTheLoaiAsync()
        {
            var list = new List<TonKhoTheoTheLoaiDTO>();

            using var con = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_BaoCao_TonKhoTheoTheLoai", con)
            {
                CommandType = CommandType.StoredProcedure
            };

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var item = new TonKhoTheoTheLoaiDTO
                {
                    MaTheLoai = reader["MaTheLoai"]?.ToString() ?? "",
                    TenTheLoai = reader["TenTheLoai"]?.ToString() ?? "",
                    SoTuaSach = reader["SoTuaSach"] != DBNull.Value ? Convert.ToInt32(reader["SoTuaSach"]) : 0,
                    TongSoBan = reader["TongSoBan"] != DBNull.Value ? Convert.ToInt32(reader["TongSoBan"]) : 0,
                    ConTrongKho = reader["ConTrongKho"] != DBNull.Value ? Convert.ToInt32(reader["ConTrongKho"]) : 0,
                    DangMuon = reader["DangMuon"] != DBNull.Value ? Convert.ToInt32(reader["DangMuon"]) : 0,
                    HuHong = reader["HuHong"] != DBNull.Value ? Convert.ToInt32(reader["HuHong"]) : 0,
                    TongTienPhat = reader["TongTienPhat"] != DBNull.Value
                        ? Convert.ToDecimal(reader["TongTienPhat"])
                        : 0m
                };

                list.Add(item);
            }

            return list;
        }

        public async Task<List<TonKhoTheoSachDTO>> GetTonKhoTheoSachAsync()
        {
            var list = new List<TonKhoTheoSachDTO>();

            using var con = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("sp_BaoCao_TonKhoTheoSach", con)
            {
                CommandType = CommandType.StoredProcedure
            };

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var item = new TonKhoTheoSachDTO
                {
                    MaSach = reader["MaSach"]?.ToString() ?? "",
                    TenSach = reader["TenSach"]?.ToString() ?? "",
                    TenTheLoai = reader["TenTheLoai"]?.ToString(),

                    TongSoBan = reader["TongSoBan"] != DBNull.Value ? Convert.ToInt32(reader["TongSoBan"]) : 0,
                    ConTrongKho = reader["ConTrongKho"] != DBNull.Value ? Convert.ToInt32(reader["ConTrongKho"]) : 0,
                    DangMuon = reader["DangMuon"] != DBNull.Value ? Convert.ToInt32(reader["DangMuon"]) : 0,
                    HuHong = reader["HuHong"] != DBNull.Value ? Convert.ToInt32(reader["HuHong"]) : 0,

                    TongTienPhat = reader["TongTienPhat"] != DBNull.Value
                        ? Convert.ToDecimal(reader["TongTienPhat"])
                        : 0m
                };

                list.Add(item);
            }

            return list;
        }
    }
}
