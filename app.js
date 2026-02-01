require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const path = require('path');

// Tell Express to use EJS and look in the 'public' folder for CSS/Images
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Main Route
app.get('/', (req, res) => {
    res.render('index', { success: req.query.success });
});

// Handle Form Submission
app.post('/contact', async (req, res) => {
    // Extract the new fields
    const { customerName, email, phone, preferredMethod, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"${customerName}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email || '', 
        subject: `New Lead: ${customerName} (Prefers ${preferredMethod})`,
        text: `New message from your website:
        
Name: ${customerName}
Email: ${email || 'Not provided'}
Phone: ${phone || 'Not provided'}
Preferred Contact: ${preferredMethod}

Message:
${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.redirect('/?success=true#contact'); 
    } catch (error) {
        console.error("Email Error:", error);
        res.redirect('/?success=false#contact');
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`HVAC site live at http://localhost:${PORT}`);
});
