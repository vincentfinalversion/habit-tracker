using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class RegisterInitiateRequest
{
    [Required, MaxLength(50)]
    public string Username { get; set; } = null!;

    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = null!;

    [Required, MinLength(8)]
    public string Password { get; set; } = null!;
}