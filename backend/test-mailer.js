import sendOTP from './utils/mailer.js';

const testMailer = async () => {
  try {
    console.log('Testing mailer...');
    await sendOTP('test@example.com', '123456');
    console.log('Mailer test completed successfully.');
  } catch (error) {
    console.error('Mailer test failed:', error.message);
  }
};

testMailer();
