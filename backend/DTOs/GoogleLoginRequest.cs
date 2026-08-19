using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class GoogleLoginRequest
{
    [Required]
    public string IdToken { get; set; } = null!; // the ID token from Google Sign-In on the client
}