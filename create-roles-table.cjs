const mysql = require('mysql2/promise');
require('dotenv').config();

async function createRolesTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    console.log('Conectado ao banco MySQL...');

    // Criar tabela user_roles
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user_roles (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(50) UNIQUE NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        description TEXT,
        permissions JSON NOT NULL DEFAULT ('[]'),
        is_system BOOLEAN NOT NULL DEFAULT FALSE,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createTableQuery);
    console.log('Tabela user_roles criada com sucesso!');

    // Inserir roles padrão do sistema
    const defaultRoles = [
      {
        name: 'admin',
        display_name: 'Administrador',
        description: 'Acesso total ao sistema com todas as permissões',
        permissions: JSON.stringify([
          'dashboard.view', 'users.view', 'users.create', 'users.edit', 'users.delete',
          'clients.view', 'clients.create', 'clients.edit', 'clients.delete',
          'team.view', 'team.create', 'team.edit', 'team.delete',
          'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
          'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete',
          'settings.view', 'settings.edit', 'reports.view'
        ]),
        is_system: true,
        active: true
      },
      {
        name: 'team',
        display_name: 'Equipe',
        description: 'Acesso às funcionalidades de equipe e projetos',
        permissions: JSON.stringify([
          'dashboard.view', 'projects.view', 'projects.edit',
          'invoices.view', 'team.view'
        ]),
        is_system: true,
        active: true
      },
      {
        name: 'client',
        display_name: 'Cliente',
        description: 'Acesso limitado para visualizar projetos e faturas',
        permissions: JSON.stringify([
          'dashboard.view', 'invoices.view', 'projects.view'
        ]),
        is_system: true,
        active: true
      }
    ];

    for (const role of defaultRoles) {
      // Verificar se a role já existe
      const [existing] = await connection.execute(
        'SELECT id FROM user_roles WHERE name = ?',
        [role.name]
      );

      if (existing.length === 0) {
        await connection.execute(
          'INSERT INTO user_roles (name, display_name, description, permissions, is_system, active) VALUES (?, ?, ?, ?, ?, ?)',
          [role.name, role.display_name, role.description, role.permissions, role.is_system, role.active]
        );
        console.log(`Role '${role.display_name}' criada com sucesso!`);
      } else {
        console.log(`Role '${role.display_name}' já existe.`);
      }
    }

    await connection.end();
    console.log('Configuração de roles concluída!');
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

createRolesTable();