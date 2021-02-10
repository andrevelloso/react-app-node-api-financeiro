import { TransactionModel } from '../models/TransactionModel.js';

const dbDate = (date) => {
  const dbDate = date.split('-');
  const day = dbDate[2];
  const month = dbDate[1];
  const year = dbDate[0];
  return { day, month, year };
};

const findAll = async (req, res) => {
  try {
    const fluxo = await TransactionModel.find({}).sort({year:1, month:1, day:1});
    res.status(200).send(fluxo);
  } catch (error) {
    res.status(500).send("Não conseguimos acessar os Lançamentos: " + error);
  }
};

// get('/api/consulta/:year/:month' -> usando com "params"
const findByYearAndMonth = async (req, res) => {
  try {
    const year = req.query.year;
    const month = req.query.month;
    //console.log(year.length);
    //console.log(parseInt(month));
    if ( year.length != 4 || parseInt(year) < 2000 || parseInt(year) > 2050 || parseInt(month) > 12) { return res.status(400).send("Erro nos paramêtros, formato esperado /yyyy/mm"); }
    const fluxoYM = await TransactionModel.find({ year, month }, { yearMonth: 0, yearMonthDay: 0 });
    res.status(200).send(fluxoYM);
  } catch (error) {
    res.status(500).send("Confira o Ano e o Mes e tente novamente: " + error);
  }
};

// get('/api/transaction/:period'           -> se for com "params"
// get('/api/transaction?period=2020-11     -> se for com "query"
const findByPeriod = async (req, res) => {
  const yearMonth = req.query.period;
  //const yearMonth = req.params.period;
  if (!yearMonth) {
    res.status(400).send("É necessario informar o parâmetro \"?period=\", cujo valor deve estar no formato yyyy-mm");
  return; }
  //console.log('Realizou consulta por periodo');
  try {
    const fluxoYM = await TransactionModel.find({ yearMonth }).sort({day: 1, type: 1});
    const data = { "length": fluxoYM.length, "transactions":fluxoYM };
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send("É necessario informar o parâmetro \"period\", cujo valor deve estar no formato yyyy-mm");
  }
};

// get('/api/transaction?description=        -> se for com "query"
const findByDescription = async (req, res) => {
  const description = req.query.description;
  if (!description) {
      res.status(400).send("É necessário informar o parâmetro \"?description=\", para buscar");
  return; }
  try {
      const data = await TransactionModel.find({ description }).sort({yearMonthDay: 1});
      res.status(200).send({ length: data.length, transactions: data });
  } catch (error) {
      res.status(500).send({error: error.message || 'Erro ao listar transações por description'});
  }
};

// Insere um Lançamento no Fluxo 
// post('/api/insere'
// post('/api/transaction
const create = async (req, res) => {
  const { description, category, value, yearMonthDay, type } = req.body;
  if (!description || !category || !value || !yearMonthDay || !type) {
     res.status(400).send("É necessário informar todos os campos para cadastrar uma transação");
  return; } 
  const { day, month, year } = dbDate(yearMonthDay);
  const transaction = new TransactionModel({
    description,
    value,
    category,
    year,
    month,
    day,
    yearMonth: `${year}-${month}`,
    yearMonthDay,
    type,
  });

  try {

    await transaction.save(transaction);
    res.status(200).send({ message: 'Transação inserida com sucesso', transaction });

  } catch (err) {
    res.status(500).send("Não foi possível inserir o Lançamento no fluxo, verifique o Erro: " + err);
  }
};

// Atualiza um Lançamento no Fluxo 
// patch('/api/transaction/:id
const update = async (req, res) => {
  const id = req.params.id;
  const { description, category, value, yearMonthDay } = req.body;
  console.log(req.body);
  console.log('chegou aqui na api - update');
  if (!description || !category || !value || !yearMonthDay) {
      res.status(400).send("Erro: Dados para atualização Inconsistente");
  return; }

  const { day, month, year } = dbDate(yearMonthDay);
  const newTransaction = {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth: `${year}-${month}`,
      yearMonthDay,
  };

  try {
    
    const transaction = await TransactionModel.findByIdAndUpdate(
      { _id: id }, newTransaction, { new: true } );

    if (!transaction) {
        res.status(404).send(`Transação com id ${id} não encontrada para atualizar`);
    } else {
        res.status(200).send({ message: 'Transação atualizada com sucesso', transaction }); 
    }

  } catch (err) {
    res.status(500).send("Não foi possível Atualizar o Lançamento no fluxo, verifique o Erro: " + err);
  }
};

// Deleta um Lançamento no Fluxo 
// delete('/api/transaction/:id
const remove = async (req, res) => {
  const id = req.params.id;
  try {
      const data = await TransactionModel.findByIdAndRemove(id);
      if (!data) {
        res.status(404).send(`Transação com id ${id} não encontrada para exclusão`);
      } else {
        res.status(200).send("Transação excluída com sucesso");
      }
  } catch (error) {
      res.status(500).send("Erro ao excluir a transação "+error);
  }
};

export default { findByPeriod, findByDescription, create, update, remove, findAll, findByYearAndMonth };

