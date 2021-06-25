// IMPORTA A FUNÇÃO INIT E A APELIDA DE INITDATABASE DO ARQUIVO `DATABASE.TS`, 
// NOTE QUE A EXTENSÃO `.TS` É OMITIDA AQUI.
import { init as initDatabase } from "./database";

// *
import express from "express";

// *
import bodyParser from "body-parser";

// *
const app = express();

// *
app.use(function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// *
app.use(bodyParser.json());

// CRIA UMA FUNÇÃO ASSÍNCRONA CHAMADA INIT() (NÃO CONFUNDIR COM A INIT DO 
// ARQUIVO DATABASE.TS) ESTA FUNÇÃO FOI CRIADA PARA QUE POSSAMOS MANIPULAR 
// EXECUÇÕES ASSÍNCRONAS UTILIZANDO AS PALAVRAS RESERVADAS ASYNC E AWAIT 
// FACILITANDO O ENTENDIMENTO DO CÓDIGO.
async function init() {
    // AGUARDA A EXECUÇÃO DA FUNÇÃO `INIT()` DO ARQUIVO `DATABASE.TS` E ARMAZENA 
    // O RETORNO DA FUNÇÃO NA CONSTANTE `DB`.
    const db = await initDatabase();

    // **
    // DEFINE A ROTA `GET /pessoa`.
app.get('/pessoa', 
// ADICIONADO A PALAVRA RESERVADA ASYNC ANTES DA DECLARAÇÃO DA FUNÇÃO QUE É 
// EXECUTADA QUANDO ESTA ROTA É REQUISITADA PELO CLIENTE, SERÁ NECESSÁRIO 
// ESPERAR A RESPOSTA DO BANCO DE DADOS PARA QUE A EXECUÇÃO DA FUNÇÃO POSSA 
// PROSSEGUIR, POR ISSO A ADIÇÃO DA PALAVRA ASYNC.
async function (request, response) {
    // EXECUTA O MÉTODO `all` DO OBJETO DE CONEXÃO COM BANCO DE DADOS `db` E 
    // SEU VALOR DE RETORNO É ARMAZENADO NA CONSTANTE `responseData`; ESTE 
    // MÉTODO EXECUTA UMA SELEÇÃO NO BANCO DE DADOS E RETORNA UM ARRAY 
    // CONTENDO TODAS AS LINHAS ENCONTRADAS.
    //
    // O PRIMEIRO PARÂMETRO É UM SQL SELECT GENÉRICO QUE RETORNARÁ TODOS OS 
    // ITENS DA TABELA.
    const responseData = await db.all("SELECT * FROM pessoa");
    // RESPONDE A REQUISIÇÃO HTTP COMO UM JSON QUE CONTÉM OS VALORES 
    // ENCONTRADOS NO BANCO DE DADOS, NOTE QUE NÃO DEFINIMOS O HTTP STATUS 
    // CODE, POR PADRÃO O HTTP STATUS CODE É `200 Ok`.
    response.json(responseData);
}
);


    // **
    // DEFINE A ROTA `POST /pessoa`.
app.post('/pessoa', 
// ADICIONADO A PALAVRA RESERVADA ASYNC ANTES DA DECLARAÇÃO DA FUNÇÃO QUE É 
// EXECUTADA QUANDO ESTA ROTA É REQUISITADA PELO CLIENTE, SERÁ NECESSÁRIO 
// ESPERAR A RESPOSTA DO BANCO DE DADOS PARA QUE A EXECUÇÃO DA FUNÇÃO POSSA 
// PROSSEGUIR, POR ISSO A ADIÇÃO DA PALAVRA ASYNC.
async function (request, response) {
    // VERIFICA SE NO CORPO DO TEXTO NÃO TEM AS CHAVES `nome`, `sobrenome` E 
    // `apelido`.
    if (!request.body.nome || !request.body.sobrenome || !request.body.apelido) {
        // CASO NÃO EXISTA UMA DAS CHAVES, O SERVIDOR RETORNA O `HTTP STATUS 
        // CODE`, `422` INFORMANDO QUE A ENTIDADE RECEBIDA NÃO PODE SER 
        // PROCESSADA.
        response.status(422); // Unprocessable Entity
        // RETORNA NO CORPO DA RESPOSTA UM OBJETO COM A CHAVE `error` QUE 
        // EXPLICA DE FORMA VERBOSA O ERRO OCORRIDO.
        response.json({ error: "dados incompletos." });
        // PARA A EXECUÇÃO DA FUNÇÃO NESTE MOMENTO, POIS SEM ESSAS 
        // INFORMAÇÕES NÃO HÁ MOTIVOS DE CONTINUAR A EXECUÇÃO.
        return;
    }

    // INICIA BLOCO DE TENTATIVA, ISSO SIGNIFICA QUE SE ALGUM DOS COMANDOS 
    // DEFINIDOS DENTRO DELE RETORNAR (throw) A EXECUÇÃO DO BLOCO É 
    // INTERROMPIDO E O FLUXO PASSA PARA O BLOCO`catch` PASSANDO COMO 
    // PARÂMETRO VALOR RETORNADO PELA LINHA QUE APRESENTOU O ERRO.
    try {
        // EXECUTA O MÉTODO `run` DO OBJETO DE CONEXÃO COM BANCO DE DADOS 
        // `db` E O RESULTADO DE SUA EXECUÇÃO É ARMAZENADO NA CONSTANTE 
        // `responseData`; ESTE MÉTODO EXECUTA QUALQUER SQL E RETORNA 
        // INFORMAÇÕES COMO A QUANTIDADE DE LINHAS AFETADAS; 
        //
        // O PRIMEIRO PARÂMETRO É UM SQL DE INSERÇÃO DE DADOS NA TABELA 
        // `pessoa` (note que os valores não foram adicionados, em seu lugar 
        // foram adicionadas âncoras `:` que serão substituídas pelos valores 
        // no momento da execução, permitindo assim que o método trate 
        // ataques de sql injection) E O SEGUNDO É UM OBJETO COM OS VALORES 
        // A SEREM SUBSTITUÍDOS PELASÃNCORAS DA STRING SQL DO PRIMEIRO 
        // PARÂMETRO.
        const responseData = await db.run(
            "INSERT INTO pessoa(nome, sobrenome, apelido) VALUES(:nome, :sobrenome, :apelido)",
            {
                ":nome": request.body.nome,
                ":sobrenome": request.body.sobrenome,
                ":apelido": request.body.apelido
            }
        );
        // RETORNA NO CORPO DA RESPOSTA UM OBJETO INFORMAÇÕES DE QUANTAS
        // LINHAS FORAM AFETADAS, NOTE QUE NÃO DEFINIMOS O HTTP STATUS CODE,
        // POR PADRÃO O HTTP STATUS CODE É `200 Ok`.
        response.json(responseData);
    } 
    // CASO UM ERRO ACONTEÇA NO BLOCO TRY, O FLUXO DE EXECUÇÃO VEM PARA O
    // BLOCO CATCH RECEBENDO COMO PARÂMETRO O ERRO OCORRIDO
    catch (e) {
        // CASO UM ERRO ACONTEÇA, O SERVIDOR RETORNA O `HTTP STATUS CODE`, 
        // `500` INFORMANDO QUE UM ERRO DE PROGRAMAÇÃO OCORREU.
        response.status(500); // Internal Server Error
        // RETORNA NO CORPO DA RESPOSTA UM OBJETO COM A CHAVE `error` QUE 
        // EXPLICA DE FORMA VERBOSA O ERRO OCORRIDO, E TAMBÉM UMA CHAVE 
        // `detail` QUE RETORNA EXATAMENTE O OBJETO DE ERRO RECEBIDO PELO 
        // BLOCO CATCH.
        response.json({ error: "database error", detail: e });
    }
}
);


    // **
    // DEFINE A ROTA `GET /pessoa/:id`.
app.get('/pessoa/:id', 
// ADICIONADO A PALAVRA RESERVADA ASYNC ANTES DA DECLARAÇÃO DA FUNÇÃO QUE É 
// EXECUTADA QUANDO ESTA ROTA É REQUISITADA PELO CLIENTE, SERÁ NECESSÁRIO 
// ESPERAR A RESPOSTA DO BANCO DE DADOS PARA QUE A EXECUÇÃO DA FUNÇÃO POSSA 
// PROSSEGUIR, POR ISSO A ADIÇÃO DA PALAVRA ASYNC.
async function (request, response) {
    // EXECUTA O MÉTODO `get` DO OBJETO DE CONEXÃO COM BANCO DE DADOS `db` E 
    // SEU VALOR DE RETORNO É GUARDADO NA CONSTANTE `responseData`; ESTE 
    // MÉTODO EXECUTA UMA SELEÇÃO NO BANCO DE DADOS E RETORNA UM OBJETO 
    // CONTENDO TODOS OS DADOS DE UMA PESSOA.
    //
    // O PRIMEIRO PARÂMETRO É UM SQL SELECT COM UMA CLÁUSULA WHERE QUE 
    // RETORNARÁ APENAS UM ITEM DA TABELA, O SEGUNDO PARÂMETRO É O VALOR A 
    // SER SUBSTITUÍDO PELA ÂNCORA, AQUI FOI OPTADO POR UTILIZAR ÃNCORAS NÃO
    // NOMEADAS `?` AO INVÉS DE ÃNCORAS NOMEADAS `:` POR TRATAR-SE DE APENAS
    // UM VALOR A SER SUBSTITUÍDO NA STRING SQL DO PRIMEIRO PARÂMETRO.
    const responseData = await db.get("SELECT * FROM pessoa WHERE id=? LIMIT 1", request.params.id);

    // VERIFICA SE EXISTE ALGUM VALOR NA CONSTANTE `responseData`, CASO NÃO
    // EXISTA É PORQUE O SELECT NÃO ENCONTROU UMA PESSOA COM O `id` INFORMADO.
    if (responseData == undefined) {
        // CASO O SELECT NÃO RETORNE VALORES, O SERVIDOR RETORNA O `HTTP 
        // STATUS CODE 404` INFORMANDO QUE NÃO FOI ENCONTRADO O DADO 
        // SOLICITADO.
        response.status(404); // Not Found
        // RETORNA NO CORPO DA RESPOSTA UM OBJETO COM A CHAVE `error` QUE 
        // EXPLICA DE FORMA VERBOSA O ERRO OCORRIDO.
        response.json({ error: "Pessoa não encontrada." });
    } 
    
    // CASO CONTRÁRIO: QUANDO `responseData` NÃO FOR INDEFINIDO (VAZIO).
    else {
        // CASO O SELECT EXECUTADO ENCONTRE ALGUM VALOR, O SERVIDOR RETORNA
        // O OBJETO CONTENDO AS INFORMAÇÕES DE PESSOA NO FORMATO JSON, NOTE 
        // QUE NÃO DEFINIMOS O HTTP STATUS CODE, POR PADRÃO O HTTP STATUS 
        // CODE É `200 Ok`.
        response.json(responseData);
    }
}
);


    // **
    // DEFINE A ROTA `PUT /pessoa/:id`.
app.put('/pessoa/:id', 
// ADICIONADO A PALAVRA RESERVADA ASYNC ANTES DA DECLARAÇÃO DA FUNÇÃO QUE É 
// EXECUTADA QUANDO ESTA ROTA É REQUISITADA PELO CLIENTE, SERÁ NECESSÁRIO 
// ESPERAR A RESPOSTA DO BANCO DE DADOS PARA QUE A EXECUÇÃO DA FUNÇÃO POSSA 
// PROSSEGUIR, POR ISSO A ADIÇÃO DA PALAVRA ASYNC.
async function (request, response) {
    // VERIFICA SE NO CORPO DO TEXTO NÃO TEM AS CHAVES `nome`, `sobrenome` E 
    // `apelido`.
    if (!request.body.nome || !request.body.sobrenome || !request.body.apelido) {
        // CASO NÃO EXISTA UMA DAS CHAVES, O SERVIDOR RETORNA O `HTTP STATUS 
        // CODE` `422` QUE INFORMA QUE A ENTIDADE RECEBIDA NÃO PODE SER 
        // PROCESSADA.
        response.status(422); // Unprocessable Entity
        // RETORNA NO CORPO DA RESPOSTA UM OBJETO COM A CHAVE `error` QUE 
        // EXPLICA DE FORMA VERBOSA O ERRO OCORRIDO.
        response.json({ error: "dados incompletos." });
        // PARA A EXECUÇÃO DA FUNÇÃO NESTE MOMENTO, POIS SEM ESSAS 
        // INFORMAÇÕES NÃO HÁ MOTIVOS DE CONTINUAR A EXECUÇÃO.
        return;
    }

    // INICIA BLOCO DE TENTATIVA, ISSO SIGNIFICA QUE SE ALGUM DOS COMANDOS 
    // DEFINIDOS DENTRO DELE RETORNAR (throw) A EXECUÇÃO DO BLOCO É 
    // INTERROMPIDO E O FLUXO PASSA PARA O BLOCO `catch` PASSANDO COMO 
    // PARÂMETRO VALOR RETORNADO PELA LINHA QUE APRESENTOU O ERRO.
    try {
        // EXECUTA O MÉTODO `run` DO OBJETO DE CONEXÃO COM BANCO DE DADOS 
        // `db` E O RESULTADO DE SUA EXECUÇÃO É ARMAZENADO NA CONSTANTE 
        // `responseData`; ESTE MÉTODO EXECUTA QUALQUER SQL E RETORNA 
        // INFORMAÇÕES COMO A QUANTIDADE DE LINHAS AFETADAS; 
        //
        // O PRIMEIRO PARÂMETRO É UM SQL DE ATUALIZAÇÃO DE DADOS NA TABELA 
        // `pessoa` (note que os valores não foram adicionados, em seu lugar 
        // foram adicionadas âncoras `:` que serão substituídas pelos valores 
        // no momento da execução, permitindo assim que o método trate 
        // ataques de sql injection) E O SEGUNDO É UM OBJETO COM OS VALORES 
        // A SEREM SUBSTITUÍDOS PELAS ÃNCORAS DA STRING SQL DO PRIMEIRO 
        // PARÂMETRO.
        const responseData = await db.run(
            "UPDATE pessoa SET nome=:nome, sobrenome=:sobrenome, apelido=:apelido WHERE id=:id",
            {
                ":id": request.params.id,
                ":nome": request.body.nome,
                ":sobrenome": request.body.sobrenome,
                ":apelido": request.body.apelido
            }
        );

        // VERIFICA SE EXISTE ALGUM VALOR NA CONSTANTE `responseData`, CASO 
        // NÃO EXISTA É PORQUE O SELECT NÃO ENCONTROU UMA PESSOA COM O `id` 
        // INFORMADO.
        if (responseData == undefined) {
            // CASO O SELECT NÃO RETORNE VALORES, O SERVIDOR RETORNA O `HTTP 
            // STATUS CODE 404` INFORMANDO QUE NÃO FOI ENCONTRADO O DADO 
            // SOLICITADO.
            response.status(404); // Not Found
            // RETORNA NO CORPO DA RESPOSTA UM OBJETO COM A CHAVE `error` 
            // QUE EXPLICA DE FORMA VERBOSA O ERRO OCORRIDO.
            response.json({ error: "Pessoa não encontrada." });
        } 
        
        // CASO CONTRÁRIO: QUANDO `responseData` NÃO FOR INDEFINIDO (VAZIO).
        else {
            // CASO O SELECT EXECUTADO ENCONTRE ALGUM VALOR, O SERVIDOR 
            // RETORNA O OBJETO CONTENDO AS INFORMAÇÕES DE PESSOA NO FORMATO 
            // JSON, NOTE QUE NÃO DEFINIMOS O HTTP STATUS CODE, POR PADRÃO O 
            // HTTP STATUS CODE É `200 Ok`.
            response.json(responseData);
        }
    }
    
    // CASO UM ERRO ACONTEÇA NO BLOCO TRY, O FLUXO DE EXECUÇÃO VEM PARA O
    // BLOCO CATCH RECEBENDO COMO PARÂMETRO O ERRO OCORRIDO
    catch (e) {
        // CASO UM ERRO ACONTEÇA, O SERVIDOR RETORNA O `HTTP STATUS CODE`, 
        // `500` INFORMANDO QUE UM ERRO DE PROGRAMAÇÃO OCORREU.
        response.status(500); // Internal Server Error
        // RETORNA NO CORPO DA RESPOSTA UM OBJETO COM A CHAVE `error` QUE 
        // EXPLICA DE FORMA VERBOSA O ERRO OCORRIDO, E TAMBÉM UMA CHAVE 
        // `detail` QUE RETORNA EXATAMENTE O OBJETO DE ERRO RECEBIDO PELO 
        // BLOCO CATCH.
        response.json({ error: "database error", detail: e });
    }
}
);


    // **
    // DEFINE A ROTA `PUT /pessoa/:id`.
app.delete('/pessoa/:id', 
// ADICIONADO A PALAVRA RESERVADA ASYNC ANTES DA DECLARAÇÃO DA FUNÇÃO QUE É 
// EXECUTADA QUANDO ESTA ROTA É REQUISITADA PELO CLIENTE, SERÁ NECESSÁRIO 
// ESPERAR A RESPOSTA DO BANCO DE DADOS PARA QUE A EXECUÇÃO DA FUNÇÃO POSSA 
// PROSSEGUIR, POR ISSO A ADIÇÃO DA PALAVRA ASYNC.
async function (request, response) {
    // EXECUTA O MÉTODO `run` DO OBJETO DE CONEXÃO COM BANCO DE DADOS `db` E 
    // O RESULTADO DE SUA EXECUÇÃO É ARMAZENADO NA CONSTANTE `responseData`; 
    // ESTE MÉTODO EXECUTA QUALQUER SQL E RETORNA INFORMAÇÕES COMO A 
    // QUANTIDADE DE LINHAS AFETADAS; 
    //
    // O PRIMEIRO PARÂMETRO É UM SQL SELECT COM UMA CLÁUSULA WHERE QUE 
    // FORÇA A BUSCA DE DADOS DE PESSOA POR ID, FAZENDO COM QUE APENAS UM 
    // ITEM DA TABELA SEJA RETORNADO, O SEGUNDO PARÂMETRO É O VALOR A 
    // SER SUBSTITUÍDO PELA ÂNCORA, AQUI FOI OPTADO POR UTILIZAR ÃNCORAS NÃO
    // NOMEADAS `?` AO INVÉS DE ANCORAS NOMEADAS `:` POR TRATAR-SE DE APENAS
    // UM VALOR A SER SUBSTITUÍDO NA STRING SQL DO PRIMEIRO PARÂMETRO.
    const responseData = await db.run("DELETE FROM pessoa WHERE id=?", request.params.id);

    // VERIFICA A QUANTIDADE DE LINHAS AFETADAS PELO DELETE, CASO O VALOR 
    // SEJA 0 SIGNIFICA QUE NADA FOI EXCLUÍDO
    if(responseData.changes == 0) {
        // CASO O DELETE ALTERE NENHUMA LINHA, O SERVIDOR RETORNA O `HTTP 
        // STATUS CODE 404` INFORMANDO QUE NÃO FOI ENCONTRADO O DADO 
        // SOLICITADO.
        response.status(404); // Not Found
        // RETORNA NO CORPO DA RESPOSTA UM OBJETO COM A CHAVE `error` QUE 
        // EXPLICA DE FORMA VERBOSA O ERRO OCORRIDO.
        response.json({ error: "Pessoa não encontrada." });
    } 
    
    // CASO CONTRÁRIO: QUANDO O NÚMERO DE LINHAS AFETADAS FOR MAIOR QUE 0.
    else {
        // CASO O DELETE ALTERE MAIS QUE 0 LINHAS, O SERVIDOR RETORNA O 
        // OBJETO CONTENDO INFORMAÇÕES COMO O NÚMERO DE LINHAS AFETADAS, 
        // NOTE QUE POR PADRÃO O HTTP STATUS CODE É `200 Ok`, POR ISSO NÃO 
        // FOI PRECISO ALTERAR O HTTP STATUS CODE.
        response.json(responseData);
    }
}
);


    // **
    app.listen(8081, () => console.log("running..."));
}

// EXECUTA A FUNÇÃO INIT() DESTE ARQUIVO.
init();
