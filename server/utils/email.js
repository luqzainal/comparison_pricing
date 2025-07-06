import nodemailer from 'nodemailer'

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
}

const FROM_EMAIL = process.env.FROM_EMAIL || '"Compare Harga" <noreply@compareharga.com>'
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// Create transporter
let transporter = null

function getTransporter() {
  if (!transporter) {
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      transporter = nodemailer.createTransporter(EMAIL_CONFIG)
    } else {
      console.warn('SMTP credentials not configured. Email will be simulated.')
      return null
    }
  }
  return transporter
}

/**
 * Base function to send email
 */
export async function sendEmail({ to, subject, text, html }) {
  const emailTransporter = getTransporter()
  
  if (!emailTransporter) {
    // Simulate email sending if not configured
    console.log('====================================')
    console.log('📧 SIMULATING EMAIL SEND 📧')
    console.log('====================================')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log('--- Text Body ---')
    console.log(text)
    console.log('--- HTML Body ---')
    console.log(html)
    console.log('====================================')
    console.log('✅ Email "sent" successfully.')
    console.log('====================================')
    return { success: true }
  }

  try {
    const info = await emailTransporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      text,
      html
    })

    console.log('✅ Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw error
  }
}

/**
 * Email templates
 */

// Email verification template
export async function sendVerificationEmail(email, token, name) {
  const verificationUrl = `${BASE_URL}/auth/verify-email?token=${token}`
  
  const subject = 'Sahkan Akaun Anda - Compare Harga'
  
  const text = `
Hai ${name},

Terima kasih kerana mendaftar dengan Compare Harga!

Untuk melengkapkan pendaftaran anda, sila klik pautan di bawah untuk mengesahkan alamat e-mel anda:

${verificationUrl}

Pautan ini akan tamat tempoh dalam 24 jam.

Jika anda tidak membuat permintaan ini, sila abaikan e-mel ini.

Terima kasih,
Pasukan Compare Harga
  `
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sahkan Akaun Anda</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛒 Compare Harga</h1>
  </div>
  <div class="content">
    <h2>Hai ${name},</h2>
    <p>Terima kasih kerana mendaftar dengan Compare Harga!</p>
    <p>Untuk melengkapkan pendaftaran anda, sila klik butang di bawah untuk mengesahkan alamat e-mel anda:</p>
    <a href="${verificationUrl}" class="button">Sahkan E-mel Saya</a>
    <p>Atau salin dan tampal pautan ini dalam pelayar anda:</p>
    <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
    <p><strong>Pautan ini akan tamat tempoh dalam 24 jam.</strong></p>
    <p>Jika anda tidak membuat permintaan ini, sila abaikan e-mel ini.</p>
  </div>
  <div class="footer">
    <p>Terima kasih,<br>Pasukan Compare Harga</p>
  </div>
</body>
</html>
  `
  
  return await sendEmail({ to: email, subject, text, html })
}

// Password reset template
export async function sendPasswordResetEmail(email, token, name) {
  const resetUrl = `${BASE_URL}/auth/reset-password?token=${token}`
  
  const subject = 'Tetapan Semula Kata Laluan - Compare Harga'
  
  const text = `
Hai ${name},

Kami menerima permintaan untuk menetapkan semula kata laluan anda di Compare Harga.

Klik pautan di bawah untuk menetapkan kata laluan baharu:

${resetUrl}

Pautan ini akan tamat tempoh dalam 1 jam.

Jika anda tidak membuat permintaan ini, sila abaikan e-mel ini dan kata laluan anda akan kekal tidak berubah.

Terima kasih,
Pasukan Compare Harga
  `
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tetapan Semula Kata Laluan</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔐 Tetapan Semula Kata Laluan</h1>
  </div>
  <div class="content">
    <h2>Hai ${name},</h2>
    <p>Kami menerima permintaan untuk menetapkan semula kata laluan anda di Compare Harga.</p>
    <p>Klik butang di bawah untuk menetapkan kata laluan baharu:</p>
    <a href="${resetUrl}" class="button">Tetapkan Semula Kata Laluan</a>
    <p>Atau salin dan tampal pautan ini dalam pelayar anda:</p>
    <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
    <div class="warning">
      <p><strong>⚠️ Penting:</strong> Pautan ini akan tamat tempoh dalam 1 jam.</p>
    </div>
    <p>Jika anda tidak membuat permintaan ini, sila abaikan e-mel ini dan kata laluan anda akan kekal tidak berubah.</p>
  </div>
  <div class="footer">
    <p>Terima kasih,<br>Pasukan Compare Harga</p>
  </div>
</body>
</html>
  `
  
  return await sendEmail({ to: email, subject, text, html })
}

// Welcome email template (after successful verification)
export async function sendWelcomeEmail(email, name) {
  const subject = 'Selamat Datang ke Compare Harga!'
  
  const text = `
Hai ${name},

Selamat datang ke Compare Harga! 🎉

Akaun anda telah berjaya disahkan dan anda kini boleh mula menggunakan platform kami untuk:

• Membandingkan harga produk dari Shopee dan Lazada
• Menetapkan alert harga untuk produk kegemaran
• Menjejaki sejarah harga
• Dan banyak lagi!

Lawati laman web kami di: ${BASE_URL}

Jika anda mempunyai sebarang soalan, jangan ragu untuk menghubungi kami.

Selamat berbelanja!

Pasukan Compare Harga
  `
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Selamat Datang</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
    .features { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .feature { margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛒 Selamat Datang ke Compare Harga!</h1>
    <p>Akaun anda telah berjaya disahkan! 🎉</p>
  </div>
  <div class="content">
    <h2>Hai ${name},</h2>
    <p>Terima kasih kerana menyertai Compare Harga! Anda kini boleh menikmati semua ciri platform kami:</p>
    
    <div class="features">
      <div class="feature">✨ <strong>Perbandingan Harga:</strong> Bandingkan harga produk dari Shopee dan Lazada</div>
      <div class="feature">🔔 <strong>Alert Harga:</strong> Dapatkan notifikasi bila harga turun</div>
      <div class="feature">📊 <strong>Sejarah Harga:</strong> Lihat trend harga produk</div>
      <div class="feature">❤️ <strong>Senarai Kegemaran:</strong> Simpan produk kegemaran anda</div>
    </div>
    
    <p>Mula jelajahi platform kami sekarang:</p>
    <a href="${BASE_URL}" class="button">Mula Berbelanja</a>
    
    <p>Jika anda mempunyai sebarang soalan, jangan ragu untuk menghubungi kami.</p>
    <p>Selamat berbelanja! 🛍️</p>
  </div>
  <div class="footer">
    <p>Pasukan Compare Harga</p>
  </div>
</body>
</html>
  `
  
  return await sendEmail({ to: email, subject, text, html })
}

// Legacy function for backward compatibility
export async function sendEmailNotification(options) {
  return await sendEmail(options)
} 