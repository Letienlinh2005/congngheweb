using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;

namespace MyWebAPI.BLL.Services
{
    public interface IKeSachService
    {
        Task<ResponseDTO<List<KeSachDTO>>> GetAllAsync();
        Task<ResponseDTO<KeSachDTO>> GetByIdAsync(string maKe);
        Task<ResponseDTO<KeSachDTO>> CreateAsync(CreateKeSachRequest request);
        Task<ResponseDTO<bool>> UpdateAsync(string maKe, UpdateKeSachRequest request);
        Task<ResponseDTO<bool>> DeleteAsync(string maKe);
    }

    public class KeSachService : IKeSachService
    {
        private readonly IKeSachRepository _repo;

        public KeSachService(IKeSachRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseDTO<List<KeSachDTO>>> GetAllAsync()
        {
            try
            {
                var list = await _repo.GetAllAsync();
                return new ResponseDTO<List<KeSachDTO>>
                {
                    Success = true,
                    Message = "Lấy danh sách kệ sách thành công",
                    Data = list
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<List<KeSachDTO>>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<KeSachDTO>> GetByIdAsync(string maKe)
        {
            try
            {
                var item = await _repo.GetByIdAsync(maKe);
                if (item == null)
                {
                    return new ResponseDTO<KeSachDTO>
                    {
                        Success = false,
                        Message = "Không tìm thấy kệ sách",
                        Data = null
                    };
                }

                return new ResponseDTO<KeSachDTO>
                {
                    Success = true,
                    Message = "Lấy thông tin thành công",
                    Data = item
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<KeSachDTO>
                {
                    Success = false,
                    Message = $"Lỗi: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<ResponseDTO<KeSachDTO>> CreateAsync(CreateKeSachRequest request)
        {
            try
            {
                var maKeVuaTao = await _repo.CreateAsync(request);

                if (!string.IsNullOrEmpty(maKeVuaTao))
                {
                    return new ResponseDTO<KeSachDTO>
                    {
                        Success = true,
                        Message = "Thêm kệ sách thành công",
                        Data = new KeSachDTO
                        {
                            maKe = maKeVuaTao,   
                            viTri = request.viTri
                        }
                    };
                }

                return new ResponseDTO<KeSachDTO>
                {
                    Success = false,
                    Message = "Không thêm được kệ sách",
                    Data = null
                };
            }
            catch (SqlException ex)
            {
                return new ResponseDTO<KeSachDTO> { Success = false, Message = $"Lỗi database: {ex.Message}" };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<KeSachDTO> { Success = false, Message = $"Lỗi: {ex.Message}" };
            }
        }

        public async Task<ResponseDTO<bool>> UpdateAsync(string maKe, UpdateKeSachRequest request)
        {
            try
            {

                var rows = await _repo.UpdateAsync(maKe, request);
                if (rows > 0)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Cập nhật kệ sách thành công",
                        Data = true
                    };
                }

                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy kệ sách",
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

        public async Task<ResponseDTO<bool>> DeleteAsync(string maKe)
        {
            try
            {
                var rows = await _repo.DeleteAsync(maKe);
                if (rows > 0)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = true,
                        Message = "Xoá kệ sách thành công",
                        Data = true
                    };
                }

                return new ResponseDTO<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy kệ sách",
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
