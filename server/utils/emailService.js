const { Resend } = require('resend');

// Resend HTTP API — works on Render free tier (no SMTP needed)

// Base template wrapper
const baseTemplate = (content, previewText = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StudyDesk</title>
  ${previewText ? `<span style="display:none!important;mso-hide:all">${previewText}</span>` : ''}
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">📚 StudyDesk</h1>
              <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Smart Study Partner</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 24px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #eee;text-align:center;">
              <p style="color:#999;font-size:12px;margin:0;">© ${new Date().getFullYear()} StudyDesk. All rights reserved.</p>
              <p style="color:#bbb;font-size:11px;margin:8px 0 0;">This is an automated email. Please do not reply.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Reusable button
const actionButton = (text, url) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td align="center">
      <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:700;font-size:15px;letter-spacing:0.3px;">${text}</a>
    </td>
  </tr>
</table>
`;

// Info row
const infoRow = (label, value) => `
<tr>
  <td style="padding:8px 0;color:#888;font-size:14px;width:40%;">${label}</td>
  <td style="padding:8px 0;color:#333;font-size:14px;font-weight:600;text-align:right;">${value}</td>
</tr>
`;

// ========== EMAIL TEMPLATES ==========

// 1. Welcome / Registration Email
const registrationEmail = (userName, userEmail) => {
  const content = `
    <h2 style="color:#1a1a2e;margin:0 0 8px;font-size:22px;">Welcome to StudyDesk! 🎉</h2>
    <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 20px;">
      Hi <strong style="color:#333;">${userName}</strong>, your account has been successfully created. 
      You're all set to start your learning journey!
    </p>
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9ff;border-radius:12px;padding:20px;margin-bottom:20px;">
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${infoRow('📧 Email', userEmail)}
          ${infoRow('👤 Role', 'Student')}
          ${infoRow('📅 Joined', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}
        </table>
      </td></tr>
    </table>

    <p style="color:#666;font-size:14px;line-height:1.6;">
      <strong>Here's what you can do:</strong>
    </p>
    <ul style="color:#555;font-size:14px;line-height:2;padding-left:20px;margin:0 0 16px;">
      <li>📝 Take quizzes across multiple subjects</li>
      <li>📊 Track your results and performance</li>
      <li>🧮 Calculate your university GPA</li>
      <li>💰 Top up your wallet for premium content</li>
    </ul>

    ${actionButton('Go to Dashboard', process.env.CLIENT_URL || 'https://studydesk.space')}
  `;
  return {
    subject: '🎓 Welcome to StudyDesk — Let\'s Start Learning!',
    html: baseTemplate(content, `Welcome aboard, ${userName}! Your StudyDesk account is ready.`)
  };
};

// 2. Payment Submitted (Manual Top-up) Email
const paymentSubmittedEmail = (userName, amount, transactionId) => {
  const content = `
    <h2 style="color:#1a1a2e;margin:0 0 8px;font-size:22px;">Payment Received 📋</h2>
    <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 20px;">
      Hi <strong style="color:#333;">${userName}</strong>, we've received your manual payment slip. 
      It is now under review by our admin team.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff8e1;border:1px solid #ffe082;border-radius:12px;padding:20px;margin-bottom:20px;">
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${infoRow('💰 Amount', `LKR ${Number(amount).toLocaleString()}`)}
          ${infoRow('🔖 Transaction ID', transactionId)}
          ${infoRow('📝 Method', 'Bank Transfer (Manual)')}
          ${infoRow('⏳ Status', '<span style="color:#ed6c02;font-weight:700;">Pending Approval</span>')}
          ${infoRow('📅 Submitted', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }))}
        </table>
      </td></tr>
    </table>

    <p style="color:#888;font-size:13px;line-height:1.5;">
      ⏱️ Your payment will typically be reviewed within <strong>24 hours</strong>. 
      You'll receive a confirmation email once approved.
    </p>

    ${actionButton('Check Wallet Status', (process.env.CLIENT_URL || 'https://studydesk.space') + '/student/wallet')}
  `;
  return {
    subject: '📋 Payment Slip Submitted — Under Review',
    html: baseTemplate(content, `Your LKR ${Number(amount).toLocaleString()} payment is under review.`)
  };
};

// 3. Payment Approved (Receipt) Email
const paymentApprovedEmail = (userName, amount, transactionId, newBalance) => {
  const content = `
    <h2 style="color:#1a1a2e;margin:0 0 8px;font-size:22px;">Payment Approved ✅</h2>
    <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 20px;">
      Great news, <strong style="color:#333;">${userName}</strong>! Your payment has been approved 
      and your wallet has been credited.
    </p>

    <!-- Receipt Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border:1px solid #bbdefb;border-radius:12px;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td style="background:#1677ff;padding:14px 20px;text-align:center;">
          <h3 style="color:#fff;margin:0;font-size:16px;font-weight:700;">🧾 PAYMENT RECEIPT</h3>
        </td>
      </tr>
      <tr>
        <td style="padding:20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${infoRow('💰 Amount Credited', `<span style="color:#52c41a;font-size:18px;font-weight:800;">LKR ${Number(amount).toLocaleString()}</span>`)}
            ${infoRow('🔖 Transaction ID', transactionId)}
            ${infoRow('📝 Payment Method', 'Bank Transfer')}
            ${infoRow('✅ Status', '<span style="color:#52c41a;font-weight:700;">Completed</span>')}
            ${infoRow('📅 Approved On', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }))}
          </table>
          <hr style="border:none;border-top:1px dashed #ccc;margin:16px 0;" />
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${infoRow('💎 New Wallet Balance', `<span style="color:#1677ff;font-size:18px;font-weight:800;">LKR ${Number(newBalance).toLocaleString()}</span>`)}
          </table>
        </td>
      </tr>
    </table>

    <p style="color:#888;font-size:13px;line-height:1.5;">
      You can now use your wallet balance to access premium quizzes and content.
    </p>

    ${actionButton('Go to Dashboard', process.env.CLIENT_URL || 'https://studydesk.space')}
  `;
  return {
    subject: '✅ Payment Approved — Wallet Credited!',
    html: baseTemplate(content, `Your LKR ${Number(amount).toLocaleString()} payment has been approved!`)
  };
};

// 4. Quiz Results Email
const quizResultEmail = (userName, quizTitle, score, totalMarks, percentage, passed) => {
  const statusColor = passed ? '#52c41a' : '#ff4d4f';
  const statusEmoji = passed ? '🎉' : '😔';
  const statusText = passed ? 'PASSED' : 'FAILED';
  
  // Grade calculation
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 75) grade = 'A-';
  else if (percentage >= 70) grade = 'B+';
  else if (percentage >= 65) grade = 'B';
  else if (percentage >= 60) grade = 'B-';
  else if (percentage >= 55) grade = 'C+';
  else if (percentage >= 50) grade = 'C';
  else if (percentage >= 45) grade = 'C-';
  else if (percentage >= 40) grade = 'D+';
  else if (percentage >= 35) grade = 'D';

  const content = `
    <h2 style="color:#1a1a2e;margin:0 0 8px;font-size:22px;">Quiz Results ${statusEmoji}</h2>
    <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 20px;">
      Hi <strong style="color:#333;">${userName}</strong>, your quiz has been graded. 
      Here are your results:
    </p>

    <!-- Result Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid ${statusColor}20;border-radius:12px;overflow:hidden;margin-bottom:20px;">
      <tr>
        <td style="background:${statusColor};padding:16px 20px;text-align:center;">
          <h3 style="color:#fff;margin:0;font-size:18px;font-weight:700;">${quizTitle}</h3>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;text-align:center;">
          <!-- Score Circle -->
          <div style="display:inline-block;border:4px solid ${statusColor};border-radius:50%;width:96px;height:96px;line-height:96px;text-align:center;margin-bottom:16px;">
            <span style="font-size:32px;font-weight:800;color:${statusColor};">${percentage}%</span>
          </div>
          <p style="margin:0 0 4px;font-size:14px;color:#888;">Score</p>
          <p style="margin:0 0 16px;font-size:20px;font-weight:700;color:#333;">${score} / ${totalMarks}</p>
          <span style="display:inline-block;background:${statusColor}15;color:${statusColor};padding:6px 20px;border-radius:20px;font-weight:700;font-size:14px;border:1px solid ${statusColor}30;">
            ${statusText}
          </span>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9ff;border-radius:8px;padding:16px;">
            <tr><td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${infoRow('📝 Quiz', quizTitle)}
                ${infoRow('📊 Percentage', `${percentage}%`)}
                ${infoRow('🏅 Grade', `<span style="font-size:18px;font-weight:800;color:${statusColor};">${grade}</span>`)}
                ${infoRow('📅 Submitted', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }))}
              </table>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>

    ${passed 
      ? '<p style="color:#52c41a;font-size:14px;font-weight:600;text-align:center;">🎊 Congratulations on passing! Keep up the great work!</p>' 
      : '<p style="color:#888;font-size:14px;text-align:center;">Don\'t give up! Review the material and try again.</p>'}

    ${actionButton('View Full Results', (process.env.CLIENT_URL || 'https://studydesk.space') + '/student/results')}
  `;
  return {
    subject: `${statusEmoji} Quiz Result: ${quizTitle} — ${percentage}% (${statusText})`,
    html: baseTemplate(content, `You scored ${percentage}% on ${quizTitle}.`)
  };
};

// ========== SEND EMAIL FUNCTION ==========
const sendEmail = async (to, emailData) => {
  // Skip if Resend API key is not configured
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email] ⚠️ Skipped (no RESEND_API_KEY configured). Would have sent to: ${to}`);
    return false;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `StudyDesk <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
      to: [to],
      subject: emailData.subject,
      html: emailData.html
    });

    if (error) {
      console.error(`[Email] ❌ Failed to send to ${to}:`, error.message);
      return false;
    }

    console.log(`[Email] ✅ Sent to ${to}: ${emailData.subject} (ID: ${data?.id})`);
    return true;
  } catch (error) {
    console.error(`[Email] ❌ Failed to send to ${to}:`, error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  registrationEmail,
  paymentSubmittedEmail,
  paymentApprovedEmail,
  quizResultEmail
};
