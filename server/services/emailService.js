
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// // 1. Setup transporter using SMTP configuration
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: parseInt(process.env.EMAIL_PORT),
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // 2. Generic email sender function
// const sendEmail = async ({ to, subject, text }) => {
//   const mailOptions = {
//     from: `"Srimatha Restaurant" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Email sent to ${to}: ${subject}`);
//     return info;
//   } catch (error) {
//     console.error(`❌ Failed to send email to ${to}:`, error.message);
//   }
// };

// export default sendEmail;

// // 3. Order Placed
// export const sendOrderPlacedEmail = async (to, name, orderId) => {
//   const subject = `Order Placed Successfully - #${orderId}`;
//   const text = `Hello ${name},\n\nYour order #${orderId} has been placed successfully. Thank you for ordering from Srimatha Restaurant!\n\nWe will notify you once it's out for delivery.\n\nRegards,\nSrimatha Team`;
//   await sendEmail({ to, subject, text });
// };

// // 4. Payment Status
// export const sendPaymentStatusEmail = async (to, name, orderId, status) => {
//   const subject = `Payment ${status === 'success' ? 'Successful' : 'Failed'} - Order #${orderId}`;
//   const text =
//     status === 'success'
//       ? `Hi ${name},\n\nYour payment for order #${orderId} was successful. We are processing your order.\n\nThank you!\n\nSrimatha Team`
//       : `Hi ${name},\n\nUnfortunately, your payment for order #${orderId} failed. Please try again or use a different payment method.\n\nRegards,\nSrimatha Team`;
//   await sendEmail({ to, subject, text });
// };

// // 5. Order Delivered
// export const sendOrderDeliveredEmail = async (to, name, orderId) => {
//   const subject = `Order Delivered - #${orderId}`;
//   const text = `Hello ${name},\n\nWe’re happy to inform you that your order #${orderId} has been successfully delivered.\n\nWe hope you enjoyed your meal!\n\nSrimatha Team`;
//   await sendEmail({ to, subject, text });
// };

// // 6. Order Cancelled
// export const sendOrderCancelledEmail = async (to, name, orderId, cancelledBy) => {
//   const subject = `Order Cancelled - #${orderId}`;
//   const text = `Hello ${name},\n\nYour order #${orderId} has been cancelled by the ${cancelledBy}.\n\nIf you have any questions, please contact our support.\n\nRegards,\nSrimatha Team`;
//   await sendEmail({ to, subject, text });
// };

// // 7. New User Signup
// export const sendNewUserSignupEmail = async (userEmail, userName, isRestaurant = false) => {
//   const subject = `Welcome to Srimatha ${isRestaurant ? 'Partner' : 'Family'}!`;
//   const text = isRestaurant
//     ? `Hello ${userName},\n\nThank you for signing up as a restaurant partner with Srimatha!\n\nWe look forward to growing with you.\n\nRegards,\nSrimatha Team`
//     : `Hello ${userName},\n\nWelcome to Srimatha! Your account has been successfully created.\n\nStart exploring delicious food near you.\n\nHappy ordering!\n\nSrimatha Team`;
//   await sendEmail({ to: userEmail, subject, text });
// };


import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Setup transporter using SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER.trim(),
    pass: process.env.EMAIL_PASS.trim(),
  },
});

// 2. Generic email sender function
const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: `"Srimatha Restaurant" <${process.env.EMAIL_USER.trim()}>`,
    to,
    bcc: process.env.ADMIN_EMAIL.trim(), // Admin receives all emails silently
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${subject}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};

export default sendEmail;

// 3. Order Placed Email
export const sendOrderPlacedEmail = async (to, name, orderId) => {
  const subject = `Order Placed Successfully - #${orderId}`;
  const text = `Hello ${name},\n\nYour order #${orderId} has been placed successfully. Thank you for ordering from Srimatha Restaurant!\n\nWe will notify you once it's out for delivery.\n\nRegards,\nSrimatha Team`;
  await sendEmail({ to, subject, text });
};

// 4. Payment Status Email
export const sendPaymentStatusEmail = async (to, name, orderId, status) => {
  const subject = `Payment ${status === 'success' ? 'Successful' : 'Failed'} - Order #${orderId}`;
  const text =
    status === 'success'
      ? `Hi ${name},\n\nYour payment for order #${orderId} was successful. We are processing your order.\n\nThank you!\n\nSrimatha Team`
      : `Hi ${name},\n\nUnfortunately, your payment for order #${orderId} failed. Please try again or use a different payment method.\n\nRegards,\nSrimatha Team`;
  await sendEmail({ to, subject, text });
};

// 5. Order Delivered Email
export const sendOrderDeliveredEmail = async (to, name, orderId) => {
  const subject = `Order Delivered - #${orderId}`;
  const text = `Hello ${name},\n\nWe’re happy to inform you that your order #${orderId} has been successfully delivered.\n\nWe hope you enjoyed your meal!\n\nSrimatha Team`;
  await sendEmail({ to, subject, text });
};

// 6. Order Cancelled Email
export const sendOrderCancelledEmail = async (to, name, orderId, cancelledBy) => {
  const subject = `Order Cancelled - #${orderId}`;
  const text = `Hello ${name},\n\nYour order #${orderId} has been cancelled by the ${cancelledBy}.\n\nIf you have any questions, please contact our support.\n\nRegards,\nSrimatha Team`;
  await sendEmail({ to, subject, text });
};

// 7. New User Signup Email
export const sendNewUserSignupEmail = async (userEmail, userName, isRestaurant = false) => {
  const subject = `Welcome to Srimatha ${isRestaurant ? 'Partner' : 'Family'}!`;
  const text = isRestaurant
    ? `Hello ${userName},\n\nThank you for signing up as a restaurant partner with Srimatha!\n\nWe look forward to growing with you.\n\nRegards,\nSrimatha Team`
    : `Hello ${userName},\n\nWelcome to Srimatha! Your account has been successfully created.\n\nStart exploring delicious food near you.\n\nHappy ordering!\n\nSrimatha Team`;
  await sendEmail({ to: userEmail, subject, text });
};
