const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

//datos de la persona que recibirá los correos de "contactenos"
const emailOwner = process.env.EMAIL;
const pass = process.env.PASS;

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.HOST,
    auth: {
        user: emailOwner,
        pass,
    },
});

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'ui', 'aires.html'));
});
app.get('/servicios', (_req, res) => {
    res.sendFile(path.join(__dirname, 'ui', 'servicios.html'));
});
app.get('/contactenos', (_req, res) => {
    res.sendFile(path.join(__dirname, 'ui', 'contactenos.html'));
});

app.post('/send', (req, res) => {
    const { nombre, direccion, correo, asunto, mensaje } = req.body;

    const mailOptions = {
        emailOwner,
        to: process.env.EMAIL,
        subject: 'Formulario de Contacto',
        text: `Nombre: ${nombre}, \nDirección: ${direccion}, \nCorreo: ${correo}, \nAsunto: ${asunto}, \nMensaje: ${mensaje};`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.redirect('/contactenos');
            console.log(`Hubo un error enviando la información! => ${error}`);
        } else {
            res.redirect('/');
            console.log(`Información enviada exitosamente! => ${JSON.stringify(info)}`);
        }
    });
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
})