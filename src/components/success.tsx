import React, { useEffect } from 'react';

const Success: React.FC = () => {
  // You may pass this dynamically based on the logged-in user or order
  const customerEmail: string = 'gopisettisai191916@gmail.com';

  useEffect(() => {
    const sendEmail = async (): Promise<void> => {
      try {
        const response = await fetch('https://ggm4eesv2d.ap-south-1.awsapprunner.com/api/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: customerEmail,
            subject: 'Thank You for Your Order!',
            text: 'Thanks for ordering from FoodX!',
            html: '<h3>Thank you for your order!</h3><p>We appreciate your business.</p>',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Email sent successfully:', result);
      } catch (error) {
        console.error('❌ Failed to send email:', error);
      }
    };

    sendEmail();
  }, [customerEmail]);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>🎉 Order Placed Successfully!</h1>
      <p>An email confirmation has been sent to <strong>{customerEmail}</strong>.</p>
    </div>
  );
};

export default Success;
