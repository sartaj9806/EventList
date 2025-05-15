const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware for CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

// Middleware for parsing JSON
app.use(express.json());


//  Define the transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.password,
  }
})

// Otp storage
let OtpStore = {};

// get Function for fetch all events
app.get('/event', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();

    await page.goto('https://www.eventbrite.com.au/d/australia--sydney/all-events/');

    const data = await page.evaluate(() => {
      const items = document.querySelectorAll('.SearchResultPanelContentEventCardList-module__eventList___2wk-D > li');

      return Array.from(items).map(item => {

        const image = item.querySelector('img')?.src;
        const title = item.querySelector('h3')?.innerText;
        const data = item.querySelector('p')?.innerText;
        const link = item.querySelector('a')?.href;


        return ({ image, data, title, link })
      });
    });

    await browser.close();
    res.json({ success: true, data: data });

  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'Internal Server Error' });
  }
});


// get function for send otp
app.post('/get-otp', async (req, res) => {

  console.log(req.body)
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: 'Email is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  OtpStore[email] = otp;

  try {

    await transporter.sendMail({
      from: process.env.email,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });

    res.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.json({ success: false, message: 'Failed to send OTP' });
  }

});

// post function for verify otp
app.post('/verify-otp', (req, res) => {


  const { email, otp } = req.body;


  if (!email || !otp) {
    return res.json({ success: false, message: 'Email and OTP are required' });
  }

  if (String(OtpStore[email]) === otp) {
    delete OtpStore[email];
    return res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    return res.json({ success: false, message: 'Invalid OTP' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on Port 3000');
});
