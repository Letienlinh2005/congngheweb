using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;

namespace MyWebAPI.BLL.Services
{
    public interface ITheLoaiService
    {
        Task<ResponseDTO<List<TheLoaiDTO>>> GetAllAsync();
        Task<ResponseDTO<TheLoaiDTO>> GetByIdAsync(string maTheLoai);
        Task<ResponseDTO<TheLoaiDTO>> CreateAsync(CreateTheLoaiRequest request);
        Task<ResponseDTO<bool>> UpdateAsync(string maTheLoai, UpdateTheLoaiRequest request);
        Task<ResponseDTO<bool>> DeleteAsync(string maTheLoai);
    }

    public class TheLoaiService : ITheLoaiService
    {
        private readonly ITheLoaiRepository _theLoaiRespository;
        public TheLoaiService(ITheLoaiRepository theLoaiRespository)
        {
            _theLoaiRespository = theLoaiRespository;
        }

        public async Task<ResponseDTO<List<TheLoaiDTO>>> GetAllAsync()
        {
            try
            {
                var list = await _theLoaiRespository.GetAllAsync();
                return new ResponseDTO<List<TheLoaiDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách thành công",
                    Data = list
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<TheLoaiDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }
        public async Task<ResponseDTO<TheLoaiDTO>> GetByIdAsync(string maTheLoai)
        {
            try
            {
                var theLoai = await _theLoaiRespository.GetByIdAsync(maTheLoai);
                if (theLoai == null)
                {
                    return new ResponseDTO<TheLoaiDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy thể loại",
                        Data = null
                    };
                }
                return new ResponseDTO<TheLoaiDTO>
                {
                    Success = true,
                    Message = "Lấy thể loại thành công",
                    Data = theLoai
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<TheLoaiDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<TheLoaiDTO>> CreateAsync(CreateTheLoaiRequest request)
        {
            var newId = "TL" + Guid.NewGuid().ToString("N")[..7].ToUpper();
            var theLoai = new TheLoaiDTO
            {
                MaTheLoai = newId,
                TenTheLoai = request.TenTheLoai
            };
            try
            {
                var created = await _theLoaiRespository.CreateAsync(theLoai);
                if (created)
                {
                    return new ResponseDTO<TheLoaiDTO>
                    {
                        Success = true,
                        Message = "Thêm thể loại thành công",
                        Data = theLoai
                    };
                }
                return new ResponseDTO<TheLoaiDTO>
                {
                    Success = false,
                    Message = "Không thể thêm thể loại",
                    Data = null
                };
            }
            catch (SqlException ex) when (ex.Number == 2627) // Vi phạm khóa chính
            {
                return new ResponseDTO<TheLoaiDTO>
                {
                    Success = false,
                    Message = "Mã thể loại đã tồn tại",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<TheLoaiDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<bool>> UpdateAsync(string maTheLoai, UpdateTheLoaiRequest request)
        {
            try
            {
                var existing = await _theLoaiRespository.GetByIdAsync(maTheLoai);
                if (existing == null)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Không tìm thấy thể loại",
                        Data = false
                    };
                }
                var theLoai = new TheLoaiDTO
                {
                    MaTheLoai = maTheLoai,
                    TenTheLoai = request.TenTheLoai
                };
                var updated = await _theLoaiRespository.UpdateAsync(maTheLoai, theLoai);
                if (updated)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Cập nhật thể loại thành công",
                        Data = true
                    };
                }
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không thể cập nhật thể loại",
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

        public async Task<ResponseDTO<bool>> DeleteAsync(string maTheLoai)
        {
            try
            {
                var existing = await _theLoaiRespository.GetByIdAsync(maTheLoai);
                if (existing == null)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = "Không tìm thấy thể loại",
                        Data = false
                    };
                }
                var deleted = await _theLoaiRespository.DeleteAsync(maTheLoai);
                if (deleted)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Xóa thể loại thành công",
                        Data = true
                    };
                }
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không thể xóa thể loại",
                    Data = false
                };
            }
            catch (SqlException ex) when (ex.Number == 547) // Vi phạm ràng buộc khóa ngoại
            {
                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không thể xóa thể loại do có dữ liệu liên quan",
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