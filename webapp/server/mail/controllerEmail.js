const nodemailer = require('nodemailer');
const path = require('path');
const KoalaWelcomeEmail = require('./emailstruture');
require('dotenv').config();

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ success: false, message: 'Les paramètres to, subject et text sont requis' });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Accepter les certificats auto-signés
      }
    });

    // Utilisez votre composant KoalaWelcomeEmail pour générer le contenu HTML
    const logoPath = path.join(__dirname, 'logo.png');
    const logoCid = 'unique@logo.cid'; // Un CID unique pour l'image
    const emailContent = KoalaWelcomeEmail(text, logoCid);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: emailContent.data, // Utilisez emailContent.data pour obtenir le contenu HTML
      attachments: [{
        filename: 'logo.png',
        path: logoPath,
        cid: logoCid
      }]
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé: %s", info.messageId);
    res.status(200).json({ success: true, message: 'Votre e-mail a été envoyé avec succès!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'e-mail', error: error.message });
  }
};

module.exports = { sendEmail };
