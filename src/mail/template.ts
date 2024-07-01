const baseStyle = `
    font-family: 'Arial', sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #ffffff;
`;

const headingStyle = `
    color: #2c3e50;
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
`;

const paragraphStyle = `
    color: #34495e;
    line-height: 1.6;
    margin-bottom: 15px;
`;

const buttonStyle = `
    display: inline-block;
    background-color: #3498db;
    color: white;
    padding: 12px 25px;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    text-align: center;
`;

const linkStyle = `
    color: #3498db;
    text-decoration: underline;
`;

const footerStyle = `
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
    font-size: 12px;
    color: #7f8c8d;
`;

export const verificationEmailTemplate = (confirmLink: string) => `
<div style="${baseStyle}">
    <h1 style="${headingStyle}">Verify Your Email Address</h1>
    <p style="${paragraphStyle}">Thank you for creating an account with Ecommerce. To ensure the security of your account and activate all features, please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmLink}" style="${buttonStyle}">Verify Email</a>
    </div>
    <p style="${paragraphStyle}">If you're unable to click the button, you can copy and paste the following link into your browser:</p>
    <p style="${linkStyle}">${confirmLink}</p>
    <p style="${paragraphStyle}">For security reasons, this verification link will expire in 24 hours. If you didn't create an account with us, please disregard this email.</p>
    <div style="${footerStyle}">
        <p>This is an automated message, please do not reply. If you need assistance, please contact our support team.</p>
        <p>© 2024 Ecommerce. All rights reserved.</p>
    </div>
</div>
`;

export const passwordResetEmailTemplate = (resetLink: string) => `
<div style="${baseStyle}">
    <h1 style="${headingStyle}">Reset Your Password</h1>
    <p style="${paragraphStyle}">We received a request to reset the password for your Ecommerce account. To proceed with the password reset, please click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="${buttonStyle}">Reset Password</a>
    </div>
    <p style="${paragraphStyle}">If you're unable to click the button, you can copy and paste the following link into your browser:</p>
    <p style="${linkStyle}">${resetLink}</p>
    <p style="${paragraphStyle}">For your security, this password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and consider changing your password as a precautionary measure.</p>
    <p style="${paragraphStyle}">Remember to choose a strong, unique password and never share it with anyone. We will never ask for your password via email or phone.</p>
    <div style="${footerStyle}">
        <p>This is an automated message, please do not reply. If you need assistance, please contact our support team.</p>
        <p>© 2024 Ecommerce. All rights reserved.</p>
    </div>
</div>
`;

export const twoFactorEmailTemplate = (token: string) => `
<div style="${baseStyle}">
    <h1 style="${headingStyle}">Your Two-Factor Authentication Code</h1>
    <p style="${paragraphStyle}">You've requested to log in using two-factor authentication. Please use the following code to complete your login process:</p>
    <div style="text-align: center; margin: 30px 0;">
        <p style="${buttonStyle}; font-size: 28px; letter-spacing: 5px;">${token}</p>
    </div>
    <p style="${paragraphStyle}">This code is valid for 5 minutes and can only be used once. Do not share this code with anyone, including Ecommerce support.</p>
    <p style="${paragraphStyle}">If you didn't attempt to log in, someone else may be trying to access your account. Please change your password immediately and contact our support team.</p>
    <p style="${paragraphStyle}">To enhance your account security:</p>
    <ul style="${paragraphStyle}">
        <li>Use a strong, unique password for your Ecommerce account</li>
        <li>Enable two-factor authentication for all your important accounts</li>
        <li>Be cautious of phishing attempts and only log in through our official website or app</li>
    </ul>
    <div style="${footerStyle}">
        <p>This is an automated message, please do not reply. If you need assistance, please contact our support team.</p>
        <p>© 2024 Ecommerce. All rights reserved.</p>
    </div>
</div>
`;