using System;
using Microsoft.Data.SqlClient;
using System.Data;
using MyWebAPI.DTO;

namespace MyWebAPI.DAL.Repositories
{
    public class PhieuMuonDAL
    {
        public interface IPhieuMuonRepository
        {
            Task<List<PhieuMuonDTO>> GetAllAsync();
            Task<PhieuMuonDTO?> GetByIdAsync(string maPhieuMuon);
            Task<bool> CreateAsync(PhieuMuonDTO phieuMuon);
            Task<bool> UpdateAsync(string maPhieuMuon, PhieuMuonDTO phieuMuon);
            Task<bool> DeleteAsync(string maPhieuMuon);
            Task<TraSachVaTinhPhatResultDTO> TraSachVaTinhPhatAsync(TraSachVaTinhPhatRequest request);
            Task<List<ChiTietPhieuMuonDTO>> GetAllChiTietPhieuMuonAsync();
            Task<bool> GiaHanAsync(string maPhieuMuon);
            Task<bool> DatChoAsync(string maSach, string maBanDoc);
            Task<List<PhieuMuonDTO>> GetByMaBanDocAsync(string maBanDoc);
        }

        public class PhieuMuonRepository : IPhieuMuonRepository
        {
            private readonly string _connStr;
            public PhieuMuonRepository(string connectionString)
            {
                _connStr = connectionString;
            }

            public async Task<List<PhieuMuonDTO>> GetAllAsync()
            {
                var list = new List<PhieuMuonDTO>();
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_GetAllPhieuMuon", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var rd = await cmd.ExecuteReaderAsync();
                while (await rd.ReadAsync())
                {
                    list.Add(new PhieuMuonDTO
                    {
                        MaPhieuMuon = rd.GetString(0),
                        MaBanSao = rd.GetString(1),
                        MaBanDoc = rd.GetString(2),
                        NgayMuon = rd.GetDateTime(3),
                        HanTra = rd.GetDateTime(4),
                        NgayTraThucTe = rd.IsDBNull(5) ? (DateTime?)null : rd.GetDateTime(5),
                        SoLanGiaHan = rd.GetInt32(6),
                        TrangThai = rd.GetString(7)
                    });
                }
                return list;
            }

            public async Task<PhieuMuonDTO?> GetByIdAsync(string maPhieuMuon)
            {
                PhieuMuonDTO? phieuMuon = null;
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_GetPhieuMuonById", con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                using var rd = await cmd.ExecuteReaderAsync();
                if (await rd.ReadAsync())
                {
                    phieuMuon = new PhieuMuonDTO
                    {
                        MaPhieuMuon = rd.GetString(0),
                        MaBanSao = rd.GetString(1),
                        MaBanDoc = rd.GetString(2),
                        NgayMuon = rd.GetDateTime(3),
                        HanTra = rd.GetDateTime(4),
                        NgayTraThucTe = rd.IsDBNull(5) ? (DateTime?)null : rd.GetDateTime(5),
                        SoLanGiaHan = rd.GetInt32(6),
                        TrangThai = rd.GetString(7)
                    };
                }
                return phieuMuon;
            }

            public async Task<bool> CreateAsync(PhieuMuonDTO phieuMuon)
            {
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_TaoPhieuMuon", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@MaPhieuMuon", phieuMuon.MaPhieuMuon);
                cmd.Parameters.AddWithValue("@MaBanSao", phieuMuon.MaBanSao);
                cmd.Parameters.AddWithValue("@MaBanDoc", phieuMuon.MaBanDoc);
                cmd.Parameters.AddWithValue("@NgayMuon", phieuMuon.NgayMuon);
                cmd.Parameters.AddWithValue("@HanTra", phieuMuon.HanTra);

                // ❌ KHÔNG truyền thêm gì nữa

                await cmd.ExecuteNonQueryAsync();
                return true;
            }

            public async Task<bool> UpdateAsync(string maPhieuMuon, PhieuMuonDTO phieuMuon)
            {
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_UpdatePhieuMuon", con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);
                cmd.Parameters.AddWithValue("@MaBanSao", phieuMuon.MaBanSao);
                cmd.Parameters.AddWithValue("@MaBanDoc", phieuMuon.MaBanDoc);
                cmd.Parameters.AddWithValue("@NgayMuon", phieuMuon.NgayMuon);
                cmd.Parameters.AddWithValue("@HanTra", phieuMuon.HanTra);
                cmd.Parameters.AddWithValue("@NgayTraThucTe", (object?)phieuMuon.NgayTraThucTe ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@SoLanGiaHan", phieuMuon.SoLanGiaHan);
                cmd.Parameters.AddWithValue("@TrangThai", (object?)phieuMuon.TrangThai ?? DBNull.Value);

                var rows = await cmd.ExecuteNonQueryAsync();
                return rows > 0 || rows == -1;
            }

            public async Task<bool> DeleteAsync(string maPhieuMuon)
            {
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_DeletePhieuMuon", con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                var rows = await cmd.ExecuteNonQueryAsync();
                return rows > 0 || rows == -1;
            }
            public async Task<TraSachVaTinhPhatResultDTO> TraSachVaTinhPhatAsync(TraSachVaTinhPhatRequest request)
            {
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                int soNgayTre = 0;
                decimal tienPhat = 0m;
                string? maPhat = null;
                PhieuMuonDTO? phieuMuon = null;

                using (var cmd = new SqlCommand("sp_TraSachVaTinhPhat", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@MaPhieuMuon", request.MaPhieuMuon);
                    cmd.Parameters.AddWithValue("@NgayTraThucTe", request.NgayTraThucTe.Date);

                    var pSoNgayTre = cmd.Parameters.Add("@SoNgayTre", SqlDbType.Int);
                    pSoNgayTre.Direction = ParameterDirection.Output;

                    var pTienPhat = cmd.Parameters.Add("@TienPhat", SqlDbType.Decimal);
                    pTienPhat.Direction = ParameterDirection.Output;
                    pTienPhat.Precision = 12;
                    pTienPhat.Scale = 2;

                    var pMaPhat = cmd.Parameters.Add("@MaPhat", SqlDbType.NVarChar, 20);
                    pMaPhat.Direction = ParameterDirection.Output;

                    await cmd.ExecuteNonQueryAsync();

                    if (pSoNgayTre.Value != DBNull.Value)
                        soNgayTre = (int)pSoNgayTre.Value;

                    if (pTienPhat.Value != DBNull.Value)
                        tienPhat = (decimal)pTienPhat.Value;

                    if (pMaPhat.Value != DBNull.Value)
                        maPhat = (string)pMaPhat.Value;
                }

                // 2) Lấy lại thông tin phiếu mượn bằng sp_GetPhieuMuonById
                using (var cmdPm = new SqlCommand("sp_GetPhieuMuonById", con))
                {
                    cmdPm.CommandType = CommandType.StoredProcedure;
                    cmdPm.Parameters.AddWithValue("@MaPhieuMuon", request.MaPhieuMuon);

                    using var rd = await cmdPm.ExecuteReaderAsync();
                    if (await rd.ReadAsync())
                    {
                        phieuMuon = new PhieuMuonDTO
                        {
                            MaPhieuMuon = rd["MaPhieuMuon"].ToString()!,
                            MaBanDoc = rd["MaBanDoc"].ToString()!,
                            MaBanSao = rd["MaBanSao"].ToString()!,
                            NgayMuon = (DateTime)rd["NgayMuon"],
                            HanTra = (DateTime)rd["HanTra"],
                            NgayTraThucTe = rd["NgayTraThucTe"] == DBNull.Value
                                              ? (DateTime?)null
                                              : (DateTime)rd["NgayTraThucTe"],
                            TrangThai = rd["TrangThai"].ToString()!,
                            SoLanGiaHan = rd["SoLanGiaHan"] == DBNull.Value
                                              ? 0
                                              : (int)rd["SoLanGiaHan"]
                        };
                    }
                }

                return new TraSachVaTinhPhatResultDTO
                {
                    PhieuMuon = phieuMuon,
                    SoNgayTre = soNgayTre,
                    TienPhat = tienPhat,
                    MaPhat = maPhat
                };
            }
            public async Task<List<ChiTietPhieuMuonDTO>> GetAllChiTietPhieuMuonAsync()
            {
                var list = new List<ChiTietPhieuMuonDTO>();

                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_GetChiTietPhieuMuon", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                using var rd = await cmd.ExecuteReaderAsync();
                while (await rd.ReadAsync())
                {
                    list.Add(new ChiTietPhieuMuonDTO
                    {
                        MaPhieuMuon = rd.GetString(0),
                        NgayMuon = rd.GetDateTime(1),
                        HoTen = rd.GetString(2),
                        TieuDe = rd.GetString(3),
                        HanTra = rd.GetDateTime(4),
                        NgayTraThucTe = rd.IsDBNull(5) ? null : rd.GetDateTime(5),
                        SoLanGiaHan = rd.GetInt32(6),
                        TrangThai = rd.GetString(7)
                    });
                }

                return list;
            }
            public async Task<bool> GiaHanAsync(string maPhieuMuon)
            {
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_GiaHanPhieuMuon", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@MaPhieuMuon", maPhieuMuon);

                await cmd.ExecuteNonQueryAsync();
                return true;
            }

            public async Task<bool> DatChoAsync(string maSach, string maBanDoc)
            {
                using var con = new SqlConnection(_connStr);
                await con.OpenAsync();

                using var cmd = new SqlCommand("sp_DatCho_Insert", con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@MaDatCho", "DC" + Guid.NewGuid().ToString("N")[..6]);
                cmd.Parameters.AddWithValue("@MaSach", maSach);
                cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);

                await cmd.ExecuteNonQueryAsync();
                return true;
            }

            public async Task<List<PhieuMuonDTO>> GetByMaBanDocAsync(string maBanDoc)
            {
                var list = new List<PhieuMuonDTO>();

                using (SqlConnection conn = new SqlConnection(_connStr))
                {
                    string query = @"
                     SELECT 
                    pm.*,
                    s.TieuDe
                    FROM PhieuMuon pm
                    JOIN BanSao bs ON pm.MaBanSao = bs.MaBanSao
                    JOIN Sach s ON bs.MaSach = s.MaSach
                    WHERE pm.MaBanDoc = @MaBanDoc
                    ORDER BY pm.NgayMuon DESC";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@MaBanDoc", maBanDoc);

                    await conn.OpenAsync();
                    var reader = await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        list.Add(new PhieuMuonDTO
                        {
                            MaPhieuMuon = reader["MaPhieuMuon"].ToString(),
                            MaBanSao = reader["MaBanSao"].ToString(),
                            TieuDe = reader["TieuDe"]?.ToString(),
                            MaBanDoc = reader["MaBanDoc"].ToString(),
                            NgayMuon = Convert.ToDateTime(reader["NgayMuon"]),
                            HanTra = Convert.ToDateTime(reader["HanTra"]),
                            NgayTraThucTe = reader["NgayTraThucTe"] as DateTime?,
                            SoLanGiaHan = Convert.ToInt32(reader["SoLanGiaHan"]),
                            TrangThai = reader["TrangThai"].ToString()
                        });
                    }
                }

                return list;
            }
        }
    }
}
