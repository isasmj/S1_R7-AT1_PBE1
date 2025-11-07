const { clienteModel } = require("../models/clienteModel");

const clienteController = {
  /**
   * Retorna os CLientes cadastrados
   * Rota GET /clientes
   * @async
   * @function selecionaTodos
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {promisse<Array<object>>} Objeto contendo o resultado da consulta
   */

  selecionaTodos: async (req, res) => {
    try {
      const resultado = await clienteModel.selelectAll();
      if (resultado.length === 0) {
        return res
          .status(200)
          .json({ message: "A consulta nao retornou resultados" });
      }
      return res
        .status(200)
        .json({ message: "Dados da tabela cliente", data: resultado });
    } catch (error) {
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
  incluiRegistro: async (req, res) => {
    try {
      const { nome, cpf } = req.body;
      if (!nome || !cpf || !isNaN(nome) || isNaN(cpf) ) {
        return res
          .status(400)
          .json({ message: "Verifique os dados enviados e tente novamente" });
      }

      const resultado = await clienteModel.insert(nome, cpf);
      if (resultado.insertId === 0) {
        throw new Error("Ocorreu um erro ao incluir o cliente");
      }
      res
        .status(201)
        .json({ message: "Registro incluído com sucesso", data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
  alteraCliente: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);
      const { nome, cpf } = req.body;
      if (!idCliente ||(!nome && !cpf) ||(!isNaN(nome) && isNaN(cpf)) ||typeof idCliente != "number") {
        return res
          .status(400)
          .json({ message: "Verifique os dados alterados e tente novamente" });
      }
      const clienteAtual = await clienteModel.selectById(idCliente);
      if (clienteAtual.length === 0) {
        return res.status(200).json({ message: "Produto não localizado" });
      }
      const novoNome = nome ?? clienteAtual[0].nome_cliente;
      const novoCPF = cpf ?? clienteAtual.cpf_cliente;

      const resultUptade = await clienteModel.update(
        idCliente,
        novoNome,
        novoCPF
      );
      if (resultUptade.affectedRows === 1 && resultUptade.changedRows === 0) {
        return res
          .status(200)
          .json({ message: "Não há alterações a serem realizadas" });
      }
      if (resultUptade.affectedRows === 1 && resultUptade.changedRows === 1) {
        return res
          .status(200)
          .json({ message: "Registro alterado com sucesso" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },

  deletaCliente: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);

      if (!idCliente || !Number.isInteger(idCliente)) {
        return res
          .status(400)
          .json({ message: "forneça um identificador válido!" });
      }
      const clienteSelecionado = await clienteModel.selectById(idCliente);
      if (clienteSelecionado.length === 0) {
        return res
          .status(200)
          .json({ message: "Produto não localizado na base de dados" });
      }
      const resultadoDelete = await clienteModel.delete(idCliente);
      if (resultadoDelete.affectedRows === 0) {
        return res
          .status(200)
          .json({ message: "Ocorreu um erro ao excluir o produto" });
      }
      res.status(200).json({ message: "Produto excluído com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
};
module.exports = { clienteController };