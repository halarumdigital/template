const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function checkPassword() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    console.log('Verificando senha do usuário admin...');

    // Buscar o usuário admin
    const [users] = await connection.execute(
      "SELECT id, email, password FROM users WHERE email = ?", 
      ['admin@sistema.com']
    );

    if (users.length === 0) {
      console.log('Usuário admin não encontrado');
      return;
    }

    const user = users[0];
    console.log('Usuário encontrado:', user.email);
    console.log('Senha no banco:', user.password);

    // Verificar se a senha é um hash bcrypt
    const isHash = user.password && user.password.startsWith('$2');
    console.log('Senha é hash bcrypt:', isHash);

    if (!isHash) {
      console.log('A senha não está com hash. Vou criar um hash para "admin123"');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      console.log('Hash gerado:', hashedPassword);
      
      // Atualizar a senha no banco
      await connection.execute(
        "UPDATE users SET password = ? WHERE email = ?",
        [hashedPassword, 'admin@sistema.com']
      );
      console.log('Senha atualizada no banco com hash');
    } else {
      // Testar se a senha "admin123" funciona
      const isValid = await bcrypt.compare('admin123', user.password);
      console.log('Senha "admin123" é válida:', isValid);
    }

    await connection.end();
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

checkPassword();