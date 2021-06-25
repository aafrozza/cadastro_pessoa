// IMPORTA O DRIVE DE CONEXÃO DA BIBLIOTECA SQLITE3.
import { Database } from 'sqlite3';
 
// IMPORTA O MÉTODO `OPEN` DA BIBLIOTECA SQLITE, ESTA BIBLIOTECA NOS PERMITE
// TRABALHAR COM BANCOS SQLITE DE MANEIRA ASSÍNCRONA.
import { open } from 'sqlite';
 
// CRIA UMA FUNÇÃO ASSÍNCRONA CHAMADA INIT() E A EXPORTA PARA QUE SEJA POSSÍVEL 
// UTILIZÁ-LA FORA DESTE MÓDULO.
export async function init() {
    // AGUARDA QUE A FUNÇÃO `OPEN`SEJA EXECUTADA, ONDE SERÁ CRIADO O ARQUIVO DE 
    // BANCO DE DADOS `SRV/DATABASE.DB` E RETORNARÁ O OBJETO DE CONEXÃO QUE
    // NOS PERMITIRÁ MANIPULAR O BANCO DE DADOS.
    const db = await open({
        filename: './database.db',
        driver: Database,
    });
 
    // CRIA A TABELA PESSOA CASO ELA NÃO EXISTA.
    await db.exec(`
        CREATE TABLE IF NOT EXISTS pessoa (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            nome      TEXT NOT NULL,
            sobrenome TEXT NOT NULL,
            apelido   TEXT NOT NULL UNIQUE
        )
    `);
 
    // A FUNÇÃO INIT() RETORNA O OBJETO D E CONEXÃO COM O BANCO DE DADOS.
    return db;
}
