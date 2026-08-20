using Google.Apis.Auth;

namespace backend.Services;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly IConfiguration _config;

    public GoogleAuthService(IConfiguration config)
    {
        _config = config;
    }

    public async Task<(string Email, bool EmailVerified)?> VerifyIdTokenAsync(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["Google:ClientId"]! }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            return (payload.Email, payload.EmailVerified);
        }
        catch (InvalidJwtException)
        {
            return null; // bad token or didnt match client id
        }
    }
}