const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    console.log('Conectado ao banco MySQL com sucesso!');

    // Verificar se a tabela users existe
    const [tables] = await connection.execute("SHOW TABLES LIKE 'users'");
    console.log('Tabela users existe:', tables.length > 0);

    if (tables.length > 0) {
      // Verificar estrutura da tabela users
      const [columns] = await connection.execute("DESCRIBE users");
      console.log('Colunas da tabela users:');
      columns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type})`);
      });

      // Verificar usuários existentes
      const [users] = await connection.execute("SELECT id, email, role FROM users LIMIT 5");
      console.log('\nUsuários existentes:');
      users.forEach(user => {
        console.log(`- ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
      });
    }

    await connection.end();
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error.message);
  }
}

testDatabase();