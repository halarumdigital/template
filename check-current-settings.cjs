const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkCurrentSettings() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    console.log('Verificando configurações atuais...');

    // Buscar configurações de logo e favicon
    const [settings] = await connection.execute(
      "SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('logo', 'favicon', 'system_logo', 'system_favicon') ORDER BY setting_key"
    );

    console.log('\nConfigurações de imagem encontradas:');
    settings.forEach(setting => {
      console.log(`- ${setting.setting_key}: ${setting.setting_value}`);
    });

    // Verificar todas as configurações
    const [allSettings] = await connection.execute(
      "SELECT setting_key, setting_value FROM system_settings ORDER BY setting_key"
    );

    console.log('\nTodas as configurações:');
    allSettings.forEach(setting => {
      console.log(`- ${setting.setting_key}: ${setting.setting_value}`);
    });

    await connection.end();
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

checkCurrentSettings();