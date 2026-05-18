using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;
using static MyWebAPI.DAL.Repositories.PhieuMuonDAL;


namespace MyWebAPI.BLL.Services
{
    public interface IPhieuMuonService
    {
        Task<ResponseDTO<List<PhieuMuonDTO>>> GetAllAsync();
        Task<ResponseDTO<PhieuMuonDTO>> GetByIdAsync(string maPhieuMuon);
        Task<ResponseDTO<PhieuMuonDTO>> CreateAsync(CreatePhieuMuonRequest request);
        Task<ResponseDTO<bool>> UpdateAsync(string maPhieuMuon, UpdatePhieuMuonRequest request);
        Task<ResponseDTO<bool>> DeleteAsync(string maPhieuMuon);
        Task<ResponseDTO<List<ChiTietPhieuMuonDTO>>> GetAllChiTietPhieuMuonAsync();

        Task<ResponseDTO<TraSachVaTinhPhatResultDTO>> TraSachVaTinhPhatAsync(TraSachVaTinhPhatRequest request);
        Task<ResponseDTO<bool>> GiaHanAsync(string maPhieuMuon);
        Task<ResponseDTO<bool>> DatChoAsync(DatChoRequest request);
        Task<ResponseDTO<List<PhieuMuonDTO>>> GetByMaBanDocAsync(string maBanDoc);
    }

    public class PhieuMuonService : IPhieuMuonService
    {
        private readonly IPhieuMuonRepository _phieuMuonRepository;
        public PhieuMuonService(IPhieuMuonRepository phieuMuonRepository)
        {
            _phieuMuonRepository = phieuMuonRepository;
        }
        public async Task<ResponseDTO<List<PhieuMuonDTO>>> GetAllAsync()
        {
            try
            {
                var list = await _phieuMuonRepository.GetAllAsync();
                return new ResponseDTO<List<PhieuMuonDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách thành công",
                    Data = list
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<PhieuMuonDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }
        public async Task<ResponseDTO<PhieuMuonDTO>> GetByIdAsync(string maPhieuMuon)
        {
            try
            {
                var phieuMuon = await _phieuMuonRepository.GetByIdAsync(maPhieuMuon);
                if (phieuMuon == null)
                {
                    return new ResponseDTO<PhieuMuonDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy phiếu mượn",
                        Data = null
                    };
                }
                return new ResponseDTO<PhieuMuonDTO>
                {
                    Success = true,
                    Message = "Lấy phiếu mượn thành công",
                    Data = phieuMuon
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<PhieuMuonDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<PhieuMuonDTO>> CreateAsync(CreatePhieuMuonRequest request)
        {
            try
            {
                var newPhieuMuon = new PhieuMuonDTO
                {
                    MaPhieuMuon = "PM" + Guid.NewGuid().ToString("N")[..7].ToUpper(),
                    MaBanSao = request.MaBanSao,
                    MaBanDoc = request.MaBanDoc,
                    NgayMuon = request.NgayMuon,
                    HanTra = request.HanTra,

                    // SP tự xử lý
                    NgayTraThucTe = null,
                    SoLanGiaHan = 0,
                    TrangThai = "Đang mở"
                };

                var result = await _phieuMuonRepository.CreateAsync(newPhieuMuon);

                return new ResponseDTO<PhieuMuonDTO>
                {
                    Success = result,
                    Message = result ? "Tạo phiếu mượn thành công" : "Không tạo được",
                    Data = result ? newPhieuMuon : null
                };
            }
            catch (SqlException ex)
            {
                return new ResponseDTO<PhieuMuonDTO>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<bool>> UpdateAsync(string maPhieuMuon, UpdatePhieuMuonRequest request)
        {
            try
            {
                var existing = await _phieuMuonRepository.GetByIdAsync(maPhieuMuon);
                if (existing == null)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Không tìm thấy phiếu mượn",
                        Data = false
                    };
                }

                var updatedEntity = new PhieuMuonDTO
                {
                    MaBanSao = request.MaBanSao,
                    MaBanDoc = request.MaBanDoc,
                    NgayMuon = request.NgayMuon,
                    HanTra = request.HanTra,
                    NgayTraThucTe = request.NgayTraThucTe,
                    SoLanGiaHan = request.SoLanGiaHan,
                    TrangThai = request.TrangThai
                };

                var updated = await _phieuMuonRepository.UpdateAsync(maPhieuMuon, updatedEntity);

                return new ResponseDTO<bool>
                {
                    Success = updated,
                    Message = updated ? "Cập nhật thành công" : "Không thể cập nhật",
                    Data = updated
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = false
                };
            }
        }
        public async Task<ResponseDTO<bool>> DeleteAsync(string maPhieuMuon)
        {
            try
            {
                var existing = await _phieuMuonRepository.GetByIdAsync(maPhieuMuon);
                if (existing == null)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Không tìm thấy phiếu mượn",
                        Data = false
                    };
                }
                var deleted = await _phieuMuonRepository.DeleteAsync(maPhieuMuon);
                if (deleted)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Xóa phiếu mượn thành công",
                        Data = true
                    };
                }
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không thể xóa phiếu mượn",
                    Data = false
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = false
                };
            }
        }
        public async Task<ResponseDTO<List<ChiTietPhieuMuonDTO>>> GetAllChiTietPhieuMuonAsync()
        {
            try
            {
                var list = await _phieuMuonRepository.GetAllChiTietPhieuMuonAsync();

                return new ResponseDTO<List<ChiTietPhieuMuonDTO>>
                {
                    Success = true,
                    Message = "Lấy chi tiết phiếu mượn thành công",
                    Data = list
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<ChiTietPhieuMuonDTO>>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                };
            }
        }
        public async Task<ResponseDTO<TraSachVaTinhPhatResultDTO>> TraSachVaTinhPhatAsync(TraSachVaTinhPhatRequest request)
        {
            try
            {
                var result = await _phieuMuonRepository.TraSachVaTinhPhatAsync(request);

                return new ResponseDTO<TraSachVaTinhPhatResultDTO>
                {
                    Success = true,
                    Message = "Trả sách & tính phạt thành công",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<TraSachVaTinhPhatResultDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }
        public async Task<ResponseDTO<bool>> GiaHanAsync(string maPhieuMuon)
        {
            try
            {
                var result = await _phieuMuonRepository.GiaHanAsync(maPhieuMuon);

                return new ResponseDTO<bool>
                {
                    Success = result,
                    Message = result ? "Gia hạn thành công" : "Gia hạn thất bại",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = false
                };
            }
        }
        public async Task<ResponseDTO<bool>> DatChoAsync(DatChoRequest request)
        {
            try
            {
                var result = await _phieuMuonRepository.DatChoAsync(request.MaSach, request.MaBanDoc);

                return new ResponseDTO<bool>
                {
                    Success = result,
                    Message = result ? "Đặt chỗ thành công" : "Đặt chỗ thất bại",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = false
                };
            }
        }
        public async Task<ResponseDTO<List<PhieuMuonDTO>>> GetByMaBanDocAsync(string maBanDoc)
        {
            var data = await _phieuMuonRepository.GetByMaBanDocAsync(maBanDoc);

            return new ResponseDTO<List<PhieuMuonDTO>>
            {
                Success = true,
                Data = data
            };
        }
    }
}