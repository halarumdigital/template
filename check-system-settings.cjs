const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSystemSettings() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    console.log('Verificando tabela system_settings...');

    // Verificar se a tabela existe
    const [tables] = await connection.execute("SHOW TABLES LIKE 'system_settings'");
    console.log('Tabela system_settings existe:', tables.length > 0);

    if (tables.length > 0) {
      // Verificar estrutura da tabela
      const [columns] = await connection.execute("DESCRIBE system_settings");
      console.log('Colunas da tabela system_settings:');
      columns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type})`);
      });

      // Verificar dados existentes
      const [settings] = await connection.execute("SELECT * FROM system_settings LIMIT 10");
      console.log('\nConfiguracoes existentes:');
      settings.forEach(setting => {
        console.log(`- ${setting.setting_key}: ${setting.setting_value} (${setting.setting_type})`);
      });
    }

    await connection.end();
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

checkSystemSettings();