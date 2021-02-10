/* 
Backend - API para persistencia de dados no MongoDB Atlas
*/
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { routes } from './routes/routes.js';
import path from 'path';
import pkg from 'dotenv';
const {dotenv} = pkg;

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
/** Vinculando o React ao app */
const __dirname = path.dirname(new URL(import.meta.url).pathname);
//console.log(__dirname);
app.use(express.static(path.join(__dirname, '/build')));
/** Rota raiz */
app.get('/api/', (_, response) => {response.send({ message: 'Bem-vindo à API de lançamentos. Acesse /transaction e siga as orientações'});});
/** Rotas principais do app */
app.use('/api/transaction', routes);

/** Conexão ao Banco de Dados  */
console.log('Iniciando conexão ao MongoDB...');
//console.log(process.env.DB_CONNECTION);
(async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log('Conectado ao MongoDB');  
  } catch (error) { console.log('Não foi possível conectar ao Atlas MongoDB: ' + error) }
})();

// Definição de porta e inicialização do app 
const APP_PORT = process.env.PORT || 3001;
app.listen(APP_PORT, () => { console.log(`Servidor iniciado na porta ${APP_PORT}`); });