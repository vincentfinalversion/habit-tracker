using System.Security.Cryptography;

namespace backend.Services;

public class OtpGenerator : IOtpGenerator
{
    public string Generate()
    {
        // Cryptographically random 6-digit code, 000000–999999, zero-padded
        var number = RandomNumberGenerator.GetInt32(0, 1_000_000);
        return number.ToString("D6");
    }
}