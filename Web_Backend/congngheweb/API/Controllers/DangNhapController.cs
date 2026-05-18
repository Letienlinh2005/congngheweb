using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyWebAPI.BLL.Services;
using MyWebAPI.DTO;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace MyWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DangNhapController : ControllerBase
    {
        private readonly ITaiKhoanService _taiKhoanService;
        private readonly IConfiguration _config;

        public DangNhapController(ITaiKhoanService taiKhoanService, IConfiguration config)
        {
            _taiKhoanService = taiKhoanService;
            _config = config;
        }

        // POST: api/DangNhap/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.TenDangNhap) || string.IsNullOrWhiteSpace(req.MatKhau))
                return BadRequest("Thiếu thông tin đăng nhập");

            // gọi BLL để nó tự gọi SP + verify bcrypt
            var result = await _taiKhoanService.DangNhapAsync(req.TenDangNhap, req.MatKhau);

            if (!result.Success || result.Data == null)
                return Unauthorized(result);

            var user = result.Data;

            // tạo JWT
            var token = GenerateAccessToken(user.MaTaiKhoan, user.TenDangNhap, user.VaiTro, user.MaBanDoc);

            return Ok(new ResponseDTO<object>
            {
                Success = true,
                Message = "Đăng nhập thành công",
                Data = new
                {
                    token,
                    user
                }
            });
        }
        [HttpPost("register-reader")]
        public async Task<IActionResult> RegisterReader([FromBody] TaoTaiKhoanBanDoc req)
        {
            if (req == null
                || string.IsNullOrWhiteSpace(req.HoTen)
                || string.IsNullOrWhiteSpace(req.Email)
                || string.IsNullOrWhiteSpace(req.DienThoai)
                || string.IsNullOrWhiteSpace(req.MatKhau))
            {
                return BadRequest(new ResponseDTO<object>
                {
                    Success = false,
                    Message = "Thiếu thông tin đăng ký."
                });
            }

            var result = await _taiKhoanService.TaoTaiKhoanBanDoc(req);

            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        private string GenerateAccessToken(string maTaiKhoan, string tenDangNhap, string vaiTro, string? maBanDoc)
        {
            var key = _config["Jwt:Key"];
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, maTaiKhoan),
                new Claim("username", tenDangNhap),
                new Claim(ClaimTypes.Role, string.IsNullOrEmpty(vaiTro) ? "User" : vaiTro),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            if (!string.IsNullOrWhiteSpace(maBanDoc))
            {
                claims.Add(new Claim("maBanDoc", maBanDoc));
            }

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
