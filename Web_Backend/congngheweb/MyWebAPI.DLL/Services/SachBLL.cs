using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;

namespace MyWebAPI.BLL.Services
{
    public interface ISachService
    {
        Task<ResponseDTO<List<SachDTO>>> GetAllAsync();
        Task<ResponseDTO<SachDTO>> GetByIdAsync(string maSach);
        Task<ResponseDTO<SachDTO>> CreateAsync(CreateSachRequest request);
        Task<ResponseDTO<bool>> UpdateAsync(string maSach, UpdateSachRequest request);
        Task<ResponseDTO<bool>> DeleteAsync(string maSach);
        Task<ResponseDTO<bool>> UpdateLienKetAnhAsync(string maSach, string lienKetAnh);
    }

    public class SachService : ISachService
    {
        private readonly ISachRepository _sachRepository;

        public SachService(ISachRepository sachRepository)
        {
            _sachRepository = sachRepository;
        }

        public async Task<ResponseDTO<List<SachDTO>>> GetAllAsync()
        {
            try
            {
                var list = await _sachRepository.GetAllAsync();
                return new ResponseDTO<List<SachDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách thành công",
                    Data = list
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<SachDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<SachDTO>> GetByIdAsync(string maSach)
        {
            try
            {
                var sach = await _sachRepository.GetByIdAsync(maSach);
                if (sach == null)
                {
                    return new ResponseDTO<SachDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy sách",
                        Data = null
                    };
                }

                return new ResponseDTO<SachDTO>
                {
                    Success = true,
                    Message = "Lấy thông tin sách thành công",
                    Data = sach
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<SachDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<SachDTO>> CreateAsync(CreateSachRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(request.TieuDe))
                {
                    return new ResponseDTO<SachDTO>
                    {
                        Success = false,
                        Message = "Tên sách không được để trống",
                        Data = null
                    };
                }

                if (string.IsNullOrWhiteSpace(request.TacGia))
                {
                    return new ResponseDTO<SachDTO>
                    {
                        Success = false,
                        Message = "Tác giả không được để trống",
                        Data = null
                    };
                }


                var newId = request.MaSach ?? "S" + Guid.NewGuid().ToString("N")[..7].ToUpper();

                var rows = await _sachRepository.CreateAsync(request, newId);

                if (rows > 0)
                {
                    var sachDTO = new SachDTO
                    {
                        MaSach = newId,
                        TieuDe = request.TieuDe,
                        TacGia = request.TacGia,
                        NamXuatBan = request.NamXuatBan,
                        MaTheLoai = request.MaTheLoai,  // ← THÊM DÒNG NÀY
                        //TheLoai = request.TheLoai,
                        NgonNgu = request.NgonNgu,
                        TomTat = request.TomTat,
                        AnhBiaUrl = request.AnhBiaUrl
                    };

                    return new ResponseDTO<SachDTO>
                    {
                        Success = true,
                        Message = "Thêm sách thành công",
                        Data = sachDTO
                    };
                }

                return new ResponseDTO<SachDTO>
                {
                    Success = false,
                    Message = "Không thêm được sách",
                    Data = null
                };
            }
            catch (SqlException ex)
            {
                return new ResponseDTO<SachDTO>
                {
                    Success = false,
                    Message = $"Lỗi database: {ex.Message}",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<SachDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<bool>> UpdateAsync(string maSach, UpdateSachRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.TieuDe))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Tên sách không được để trống",
                        Data = false
                    };
                }

                if (string.IsNullOrWhiteSpace(request.TacGia))
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Tác giả không được để trống",
                        Data = false
                    };
                }

                var rows = await _sachRepository.UpdateAsync(maSach, request);

                if (rows > 0)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Cập nhật thành công",
                        Data = true
                    };
                }

                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy sách",
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

        public async Task<ResponseDTO<bool>> DeleteAsync(string maSach)
        {
            try
            {
                var rows = await _sachRepository.DeleteAsync(maSach);

                if (rows > 0)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Xoá thành công",
                        Data = true
                    };
                }

                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy sách",
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
        public async Task<ResponseDTO<bool>> UpdateLienKetAnhAsync(string maSach, string lienKetAnh)
        {
            try
            {
                var updated = await _sachRepository.UpdateLienKetAnhAsync(maSach, lienKetAnh);
                if (updated)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Cập nhật liên kết ảnh thành công",
                        Data = true
                    };
                }
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy sách",
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
    }
}