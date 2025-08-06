import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const votosPath = path.join(__dirname, 'votos.json');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Inicializar archivo votos si no existe
if (!fs.existsSync(votosPath)) {
  fs.writeFileSync(votosPath, JSON.stringify({ a: 0, b: 0, c: 0 }, null, 2));
}

// API para votar
app.post('/votar', (req, res) => {
  const { candidato } = req.body;

  if (!['a', 'b', 'c'].includes(candidato)) {
    return res.status(400).json({ error: 'Candidato inválido' });
  }

  const votos = JSON.parse(fs.readFileSync(votosPath, 'utf8'));
  votos[candidato]++;
  fs.writeFileSync(votosPath, JSON.stringify(votos, null, 2));
  res.json({ ok: true });
});

// API para obtener resultados
app.get('/resultados', (req, res) => {
  const votos = JSON.parse(fs.readFileSync(votosPath, 'utf8'));
  res.json(votos);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
