using AngularAuthAPI.Context;
using AngularAuthAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace AngularAuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;

        public UserController(AppDbContext appDbContext)
        {
            _authContext = appDbContext;
        }

        [Authorize]
        [HttpGet("protected")]
        public IActionResult ProtectedResource()
        {
            // This method is protected, only accessible with a valid token.
            return Ok(new { Message = "This is a protected resource." });
        }


        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userobj)
        {
            if (userobj == null)
                return BadRequest();

            var user = await _authContext.Users.FirstOrDefaultAsync(x => x.Username == userobj.Username && x.Password == userobj.Password);

            if (user == null)
            {
                return NotFound(new { Message = "User not Found!" });
            }
            else
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("n5WJ4mqz!uH6sbG8@PvY9Lk#7^E2*3Q"); // Replace with your secret key
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                new Claim(ClaimTypes.Name, user.Username),
                        // Add more claims as needed
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(2), // Set your desired token expiration time
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new { Message = "Login Successfully!", Token = tokenString });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userobj)
        {
            if (userobj == null)
                return BadRequest();

            var existingUser = await _authContext.Users.FirstOrDefaultAsync(x => x.Username == userobj.Username);

            if (existingUser != null)
            {
                // Username is not available
                return BadRequest(new { Message = "Username is not available." });
            }

            existingUser = await _authContext.Users.FirstOrDefaultAsync(x => x.Email == userobj.Email);

            if (existingUser != null)
            {
                // User is already registered with this email
                return BadRequest(new { Message = "User is already registered with this email." });
            }

            await _authContext.Users.AddAsync(userobj);
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "User Registered!" });
        }

        [HttpGet("checkSessionStatus")]
        public IActionResult CheckSessionStatus()
        {
            if (HttpContext.Session.GetInt32("UserId") != null)
            {
                // User is authenticated. Check for session expiration.
                var lastActivityString = HttpContext.Session.GetString("LastActivity");
                if (!string.IsNullOrEmpty(lastActivityString))
                {
                    var lastActivityTime = Convert.ToDateTime(lastActivityString);
                    var currentTime = DateTime.Now;
                    var sessionTimeout = TimeSpan.FromMinutes(2); // Adjust to your session timeout.

                    if (currentTime - lastActivityTime <= sessionTimeout)
                    {
                        // Session is still valid
                        return Ok();
                    }
                }
            }

            // Session has expired
            return Unauthorized();
        }
    }
}
