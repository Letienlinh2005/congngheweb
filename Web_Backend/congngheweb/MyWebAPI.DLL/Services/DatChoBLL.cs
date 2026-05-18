using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using MyWebAPI.DAL;
using MyWebAPI.DTO;

namespace MyWebAPI.BLL
{
    public interface IDatChoService
    {
        Task<string> TaoDatChoAsync(DatChoCreateRequest req);
        Task<DatChoDTO?> GetByIdAsync(string id);
        Task<List<DatChoDTO>> ListAsync(string? maBanDoc, string? maSach, string? trangThai);
        Task<string?> ChuyenSangGiuAsync(string maSach, int giuTrongGio = 48);
        Task<int> HuyAsync(string maDatCho);
        Task<int> HetHanAsync();
    }

    public class DatChoService : IDatChoService
    {
        private readonly IDatChoStorage _storage;
        public DatChoService(IDatChoStorage storage) => _storage = storage;

        public async Task<string> TaoDatChoAsync(DatChoCreateRequest req)
        {
            if (req == null) throw new ArgumentNullException(nameof(req));
            if (string.IsNullOrWhiteSpace(req.MaSach)) throw new ArgumentException("Mã sách không được để trống.", nameof(req.MaSach));
            if (string.IsNullOrWhiteSpace(req.MaBanDoc)) throw new ArgumentException("Mã bạn đọc không được để trống.", nameof(req.MaBanDoc));

            var id = "HC" + Guid.NewGuid().ToString("N")[..18];

            var dto = new DatChoDTO
            {
                MaDatCho = id,
                MaSach = req.MaSach.Trim(),
                MaBanDoc = req.MaBanDoc.Trim(),
                TrangThai = "Chờ hàng"
            };

            try
            {
                await _storage.InsertAsync(dto);
            }
            catch (SqlException ex) when (ex.Number is 2601 or 2627)
            {
                throw new InvalidOperationException("Bạn đã có một yêu cầu 'Chờ hàng' cho sách này.", ex);
            }

            return id;
        }

        public Task<DatChoDTO?> GetByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) throw new ArgumentException("Mã đặt chỗ không hợp lệ.", nameof(id));
            return _storage.GetByIdAsync(id);
        }

        public Task<List<DatChoDTO>> ListAsync(string? maBanDoc, string? maSach, string? trangThai)
            => _storage.ListAsync(maBanDoc, maSach, trangThai);

        public Task<string?> ChuyenSangGiuAsync(string maSach, int giuTrongGio = 48)
        {
            if (string.IsNullOrWhiteSpace(maSach)) throw new ArgumentException("Mã sách không hợp lệ.", nameof(maSach));
            if (giuTrongGio <= 0) giuTrongGio = 48;
            return _storage.SetReadyAsync(maSach, giuTrongGio);
        }

        public Task<int> HuyAsync(string maDatCho)
        {
            if (string.IsNullOrWhiteSpace(maDatCho)) throw new ArgumentException("Mã đặt chỗ không hợp lệ.", nameof(maDatCho));
            return _storage.CancelAsync(maDatCho);
        }

        public Task<int> HetHanAsync() => _storage.ExpireReadyAsync();
    }
}
