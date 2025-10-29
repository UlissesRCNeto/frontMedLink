const express = require('express');
const path = require('path');
const os = require('os');
const app = express();

// Caminhos absolutos para cada front-end
const comumPath = path.join(__dirname, 'pages');
const medicoPath = path.join(__dirname, '../front-medico');
const pacientePath = path.join(__dirname, '../front-paciente');

app.get('/', (req, res) => {
    res.sendFile(path.join(comumPath, 'index.html'));
});

// Rota para o front do médico
app.get('/medico', (req, res) => {
    res.sendFile(path.join(medicoPath, 'index.html'));
    console.log('get medico acessada')
});

app.get('/medico/home', (req, res) => {
    res.sendFile(path.join(medicoPath, 'pages/home.html'));
});

app.get('/medico/paciente', (req, res) => {
    res.sendFile(path.join(medicoPath, 'pages/paciente.html'));
});

app.get('/medico/qrcode', (req, res) => {
    res.sendFile(path.join(medicoPath, 'pages/qrcode.html'));
});

// Rota para o front do paciente
app.get('/paciente', (req, res) => {
    res.sendFile(path.join(pacientePath, 'index.html'));
});

app.get('/paciente/login', (req, res) => {
    // CORREÇÃO: Verifique qual é a estrutura real da pasta front-paciente
    const loginPath = path.join(pacientePath, '/login.html');
    console.log('Tentando acessar:', loginPath); // Para debug
    
    res.sendFile(loginPath);
});

// Configuração de arquivos estáticos - CORRIGIDA
app.use('/medico/imgs', express.static(path.join(medicoPath, 'imgs')));
app.use('/imgs', express.static(path.join(comumPath, 'imgs')));
app.use('/medico/pages', express.static(path.join(medicoPath, 'pages')));
app.use('/medico/img', express.static(path.join(medicoPath, 'imgs')));
app.use('/', express.static(comumPath));
app.use('/medico', express.static(medicoPath));

// CORREÇÃO: Configuração correta para o paciente
app.use('/paciente', express.static(pacientePath));
app.use('/paciente/login', express.static(path.join(pacientePath, 'login'))); // Corrigido: pacientePath em vez de medicoPath
app.use('/paciente/imagem', express.static(path.join(pacientePath, 'imagem')));


// Função para obter o IP local (mantida igual)
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    const vpnKeywords = ['vpn', 'radmin', 'openvpn', 'tun', 'tap'];

    for (const devName in interfaces) {
        const iface = interfaces[devName];
        if (devName.toLowerCase().includes('wi-fi') ||
            devName.toLowerCase().includes('wireless') ||
            devName.toLowerCase().includes('wlan')) {
            for (let i = 0; i < iface.length; i++) {
                const alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }

    for (const devName in interfaces) {
        const iface = interfaces[devName];
        const isVPN = vpnKeywords.some(keyword => devName.toLowerCase().includes(keyword));
        if (!isVPN && (devName.toLowerCase().includes('ethernet') ||
            devName.toLowerCase().includes('lan'))) {
            for (let i = 0; i < iface.length; i++) {
                const alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }

    for (const devName in interfaces) {
        const iface = interfaces[devName];
        const isVPN = vpnKeywords.some(keyword => devName.toLowerCase().includes(keyword));
        if (!isVPN) {
            for (let i = 0; i < iface.length; i++) {
                const alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }

    return 'localhost';
}

// Inicia o servidor
const PORT = 3000;
const localIP = getLocalIP();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║          Servidor MedLink rodando! 🌐                 ║
╚═══════════════════════════════════════════════════════╝

📍 ACESSO LOCAL (mesma máquina):
   Página inicial:  http://localhost:${PORT}/
   Front Médico:    http://localhost:${PORT}/medico
   Front Paciente:  http://localhost:${PORT}/paciente

🌍 ACESSO NA REDE LOCAL (outros dispositivos):
   Página inicial:  http://${localIP}:${PORT}/
   Front Médico:    http://${localIP}:${PORT}/medico
   Front Paciente:  http://${localIP}:${PORT}/paciente/login

💡 Certifique-se de que o firewall permite conexões na porta ${PORT}
    `);
});