namespace backend.Services;

public interface IGoogleAuthService
{
    Task<(string Email, bool EmailVerified)?> VerifyIdTokenAsync(string idToken);
}