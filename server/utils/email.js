/**
 * Placeholder for a real email sending service.
 * In a real application, this would integrate with a service like
 * SendGrid, Mailgun, or Nodemailer.
 * 
 * @param {object} options
 * @param {string} options.to The recipient's email address.
 * @param {string} options.subject The email subject.
 * @param {string} options.text The plain text body of the email.
 * @param {string} options.html The HTML body of the email.
 */
export async function sendEmailNotification({ to, subject, text, html }) {
  console.log('====================================');
  console.log('📧 SIMULATING EMAIL SEND 📧');
  console.log('====================================');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('--- Text Body ---');
  console.log(text);
  console.log('--- HTML Body ---');
  console.log(html);
  console.log('====================================');
  console.log('✅ Email "sent" successfully.');
  console.log('====================================');

  // In a real implementation, you would have something like:
  //
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({
  //   from: '"CompareHarga" <noreply@compareharga.com>',
  //   to,
  //   subject,
  //   text,
  //   html,
  // });

  return Promise.resolve({ success: true });
} 