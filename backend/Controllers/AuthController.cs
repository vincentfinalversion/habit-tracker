using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;
    private readonly IOtpGenerator _otpGenerator;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IConfiguration _config;

    public AuthController(
        AppDbContext db,
        IEmailService emailService,
        IOtpGenerator otpGenerator,
        IPasswordHasher passwordHasher,
        IConfiguration config)
    {
        _db = db;
        _emailService = emailService;
        _otpGenerator = otpGenerator;
        _passwordHasher = passwordHasher;
        _config = config;
    }

    [HttpPost("register/initiate")]
    public async Task<IActionResult> RegisterInitiate(RegisterInitiateRequest request)
    {
        if (!request.Email.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Only Gmail addresses are accepted." });

        var usernameTaken = await _db.Users.AnyAsync(u => u.Username == request.Username);
        if (usernameTaken)
            return Conflict(new { message = "Username is already taken." });

        var emailRegistered = await _db.Users.AnyAsync(u => u.Email == request.Email);
        if (emailRegistered)
            return Conflict(new { message = "An account with this email already exists." });

        var otpExpiryMinutes = _config.GetValue<int>("Otp:ExpiryMinutes");
        var otpCode = _otpGenerator.Generate();
        var passwordHash = _passwordHasher.Hash(request.Password);

        var existingPending = await _db.PendingRegistrations
            .FirstOrDefaultAsync(p => p.Email == request.Email);

        if (existingPending is not null)
        {
            existingPending.Username = request.Username;
            existingPending.PasswordHash = passwordHash;
            existingPending.OtpCode = otpCode;
            existingPending.OtpExpiresAt = DateTime.UtcNow.AddMinutes(otpExpiryMinutes);
        }
        else
        {
            _db.PendingRegistrations.Add(new PendingRegistration
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash,
                OtpCode = otpCode,
                OtpExpiresAt = DateTime.UtcNow.AddMinutes(otpExpiryMinutes)
            });
        }

        await _db.SaveChangesAsync();
        await _emailService.SendOtpEmailAsync(request.Email, otpCode);

        return Ok(new { message = "Verification code sent to your email." });
    }

    [HttpPost("register/verify")]
    public async Task<IActionResult> RegisterVerify(RegisterVerifyRequest request)
    {
        var pending = await _db.PendingRegistrations
            .FirstOrDefaultAsync(p => p.Email == request.Email);

        if (pending is null)
            return NotFound(new { message = "No pending registration found for this email." });

        if (pending.OtpExpiresAt < DateTime.UtcNow)
            return BadRequest(new { message = "Verification code has expired. Please register again." });

        if (pending.OtpCode != request.OtpCode)
            return BadRequest(new { message = "Incorrect verification code." });

        var user = new User
        {
            Username = pending.Username,
            Email = pending.Email,
            PasswordHash = pending.PasswordHash
        };

        _db.Users.Add(user);
        _db.PendingRegistrations.Remove(pending);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Account successfully registered." });
    }
}