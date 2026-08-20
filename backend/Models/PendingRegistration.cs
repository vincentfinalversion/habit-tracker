using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class PendingRegistration
{
    public int Id { get; set; }

    [Required, MaxLength(50)]
    public string Username { get; set; } = null!;

    [Required, MaxLength(256)]
    public string Email { get; set; } = null!;

    [Required]
    public string PasswordHash { get; set; } = null!;

    [Required, MaxLength(6)]
    public string OtpCode { get; set; } = null!;

    public DateTime OtpExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}