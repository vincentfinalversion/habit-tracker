using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace backend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendOtpEmailAsync(string toEmail, string otpCode)
    {
        var message = new MimeMessage();

        message.From.Add(new MailboxAddress(
            _config["Email:FromName"],
            _config["Email:FromAddress"]!
        ));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = "Your verification code";

        message.Body = new TextPart("plain")
        {
            Text = $"Your verification code is: {otpCode}\n\nThis code expires in {_config["Otp:ExpiryMinutes"]} minutes."
        };

        using var client = new SmtpClient();

        await client.ConnectAsync(
            _config["Email:SmtpHost"]!,
            int.Parse(_config["Email:SmtpPort"]!),
            SecureSocketOptions.StartTls
        );

        await client.AuthenticateAsync(
            _config["Email:SmtpUsername"]!,
            _config["Email:SmtpPassword"]!
        );

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}