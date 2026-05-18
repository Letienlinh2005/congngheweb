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
    public class PhatDAL
    {
        public interface IPhatRepository
        {
            Task<List<GetAllPhatDTO>> GetAllAsync();
            Task<List<GetPhatByMaBanDocDTO?>> GetPhatByMaBanDocAsync(string maBanDoc);
            Task<(int soNgayTre, decimal tienPhat, string? maPhat)> TraSachVaTinhPhatAsync(TraSachDTO dto);
            Task <bool> ThanhToanAsync(ThanhToanRequest dto);
        }

        public class PhatRepository : IPhatRepository
        {
            private readonly string _connStr;
            public PhatRepository(string connectionString) => _connStr = connectionString;


            public async Task<List<GetAllPhatDTO>> GetAllAsync()
            {
                var list = new List<GetAllPhatDTO>();

                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();
                using var cmd = new SqlCommand("sp_GetAllPhat", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var rd = await cmd.ExecuteReaderAsync();
                while (await rd.ReadAsync())
                {
                    list.Add(new GetAllPhatDTO
                    {
                        MaPhat = rd.GetString(0),
                        SoTien = rd.GetDecimal(1),
                        LyDo = rd.GetString(2),
                        NgayTinh = rd.GetDateTime(3),
                        TrangThai = rd.GetString(4),
                        MaPhieuMuon = rd.GetString(5),
                        MaBanDoc = rd.GetString(6),
                        HoTen = rd.GetString(7),
                        TieuDe = rd.GetString(8),
                    });
                }
                return list;
            }
            public async Task<List<GetPhatByMaBanDocDTO>> GetPhatByMaBanDocAsync(string maBanDoc)
            {
                var list = new List<GetPhatByMaBanDocDTO>();

                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_GetPhatByMaBanDoc", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);

                using var rd = await cmd.ExecuteReaderAsync();

                while (await rd.ReadAsync())
                {
                    list.Add(new GetPhatByMaBanDocDTO
                    {
                        MaPhat = rd.GetString(0),
                        SoTien = rd.GetDecimal(1),
                        LyDo = rd.GetString(2),
                        NgayTinh = rd.GetDateTime(3),
                        TrangThai = rd.GetString(4),
                        TieuDe = rd.GetString(5)
                    });
                }

                return list;
            }

            public async Task<(int soNgayTre, decimal tienPhat, string? maPhat)> TraSachVaTinhPhatAsync(TraSachDTO dto)
            {
                using var con = new SqlConnection(_connStr);
                using var cmd = new SqlCommand("sp_TraSachVaTinhPhat", con) { CommandType = CommandType.StoredProcedure };

                cmd.Parameters.AddWithValue("@MaPhieuMuon", dto.MaPhieuMuon);
                cmd.Parameters.AddWithValue("@NgayTraThucTe", dto.NgayTraThucTe);

                var pSoNgayTre = new SqlParameter("@SoNgayTre", SqlDbType.Int) { Direction = ParameterDirection.Output };
                var pTienPhat = new SqlParameter("@TienPhat", SqlDbType.Decimal) { Precision = 12, Scale = 2, Direction = ParameterDirection.Output };
                var pMaPhat = new SqlParameter("@MaPhat", SqlDbType.NVarChar, 20) { Direction = ParameterDirection.Output };
                cmd.Parameters.AddRange(new[] { pSoNgayTre, pTienPhat, pMaPhat });

                await con.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                int soNgayTre = pSoNgayTre.Value is DBNull ? 0 : (int)pSoNgayTre.Value;
                decimal tienPhat = pTienPhat.Value is DBNull ? 0m : (decimal)pTienPhat.Value;
                string? maPhat = pMaPhat.Value is DBNull ? null : (string)pMaPhat.Value;

                return (soNgayTre, tienPhat, maPhat);
            }

            public async Task<bool> ThanhToanAsync(ThanhToanRequest dto)
            {
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_ThanhToanPhat", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                var maThanhToan = "TT" + Guid.NewGuid().ToString("N")[..6].ToUpper();

                cmd.Parameters.AddWithValue("@MaPhat", dto.MaPhat);
                cmd.Parameters.AddWithValue("@MaThanhToan", maThanhToan);
                cmd.Parameters.AddWithValue("@HinhThuc", dto.HinhThuc);
                cmd.Parameters.AddWithValue("@GhiChu", dto.GhiChu ?? "");

                await cmd.ExecuteNonQueryAsync();
                return true;
            }
        }
    }
}
