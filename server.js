const express = require('express');
const path = require('path');
const jsonServer = require('json-server');
const app = express();
const PORT = process.env.PORT || 5000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'build')));

// Ruta para JSON Server
app.use('/src/api', jsonServer.router('db.json'));

// Manejar todas las demás rutas con el archivo HTML de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});