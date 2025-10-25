const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;

// Função para obter o IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const interface of interfaces[interfaceName]) {
            // IPv4 e não é interno
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

const LOCAL_IP = getLocalIP();

// Função para ler arquivos HTML
function serveHTML(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Página não encontrada</h1>');
            return;
        }
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

// Criando o servidor
const server = http.createServer((req, res) => {
    console.log(`Requisição recebida: ${req.url} - IP: ${req.socket.remoteAddress}`);
    
    // Configurar CORS para permitir acesso da rede local
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Rota para médico
    if (req.url === '/front/medico' || req.url === '/front/medico/') {
        const filePath = path.join(__dirname, '../front-medico/index.html');
        serveHTML(filePath, res);
    }
    // Rota para paciente
    else if (req.url === '/front/paciente' || req.url === '/front/paciente/') {
        const filePath = path.join(__dirname, '../front-paciente/index.html');
        serveHTML(filePath, res);
    }
    // Rota raiz
    else if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <head>
                    <title>Sistema Médico - Rede Local</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; }
                        h1 { color: #333; }
                        ul { list-style-type: none; padding: 0; }
                        li { margin: 10px 0; }
                        a { 
                            text-decoration: none; 
                            color: white; 
                            background: #007bff; 
                            padding: 10px 15px; 
                            border-radius: 5px;
                            display: inline-block;
                        }
                        a:hover { background: #0056b3; }
                        .info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <h1>Sistema Médico - Disponível na Rede Local</h1>
                    <div class="info">
                        <strong>IP do Servidor:</strong> ${LOCAL_IP}<br>
                        <strong>Porta:</strong> ${PORT}
                    </div>
                    <ul>
                        <li><a href="/front/medico">Área do Médico</a></li>
                        <li><a href="/front/paciente">Área do Paciente</a></li>
                    </ul>
                    <p><strong>URLs de acesso para outros dispositivos:</strong></p>
                    <ul>
                        <li>http://${LOCAL_IP}:${PORT}/front/medico</li>
                        <li>http://${LOCAL_IP}:${PORT}/front/paciente</li>
                    </ul>
                </body>
            </html>
        `);
    }
    // Rota não encontrada
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Página não encontrada</h1>');
    }
});

// Iniciando o servidor
server.listen(PORT, '0.0.0.0', () => {
    console.log('=' .repeat(60));
    console.log('🚀 SERVIDOR RODANDO NA REDE LOCAL');
    console.log('=' .repeat(60));
    console.log(`📍 IP Local: http://${LOCAL_IP}:${PORT}`);
    console.log(`📍 Localhost: http://localhost:${PORT}`);
    console.log('=' .repeat(60));
    console.log('📋 URLs de Acesso:');
    console.log(`   👨‍⚕️  Médico: http://${LOCAL_IP}:${PORT}/front/medico`);
    console.log(`   👤 Paciente: http://${LOCAL_IP}:${PORT}/front/paciente`);
    console.log('=' .repeat(60));
    console.log('💡 Dica: Use os URLs acima em outros dispositivos da mesma rede');
    console.log('=' .repeat(60));
});

// Tratamento de erros
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Porta ${PORT} já está em uso!`);
        console.log('💡 Tente mudar a porta no código ou fechar o aplicativo que está usando esta porta');
    } else {
        console.log('❌ Erro no servidor:', err);
    }
});