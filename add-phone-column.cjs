const mysql = require('mysql2/promise');
require('dotenv').config();

async function addPhoneColumn() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    console.log('Conectado ao banco MySQL...');

    // Verificar se a coluna phone já existe
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM users LIKE 'phone'"
    );

    if (columns.length === 0) {
      console.log('Adicionando coluna phone à tabela users...');
      await connection.execute(
        "ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER last_name"
      );
      console.log('Coluna phone adicionada com sucesso!');
    } else {
      console.log('Coluna phone já existe na tabela users.');
    }

    await connection.end();
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

addPhoneColumn();