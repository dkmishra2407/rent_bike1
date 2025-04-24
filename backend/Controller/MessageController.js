// // controllers/messageController.js
// import Message from "../Models/Message.js";
// import nodemailer from "nodemailer";

module.exports.sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Save message to DB
    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // App Password (not regular password)
      },
    });

    const mailOptions = {
      from: email,
      to: "papdiwalom@gmail.com",
      subject: `New Contact Message: ${subject}`,
      html: `
        <h3>You received a new message from ${name} (${email})</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};
