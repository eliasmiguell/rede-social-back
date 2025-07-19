import { db } from '../connect.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tabela para controlar as migrations executadas
const createMigrationsTable = async () => {
  try {
    await db`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela de migrations criada/verificada');
  } catch (error) {
    console.error('❌ Erro ao criar tabela de migrations:', error);
    throw error;
  }
};

// Verifica se uma migration já foi executada
const isMigrationExecuted = async (filename) => {
  try {
    const result = await db`SELECT id FROM migrations WHERE filename = ${filename}`;
    return result.length > 0;
  } catch (error) {
    console.error('❌ Erro ao verificar migration:', error);
    return false;
  }
};

// Marca uma migration como executada
const markMigrationAsExecuted = async (filename) => {
  try {
    await db`INSERT INTO migrations (filename) VALUES (${filename})`;
    console.log(`✅ Migration ${filename} marcada como executada`);
  } catch (error) {
    console.error('❌ Erro ao marcar migration como executada:', error);
    throw error;
  }
};

// Executa uma migration
const executeMigration = async (filename) => {
  try {
    const filePath = path.join(__dirname, filename);
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    console.log(`🔄 Executando migration: ${filename}`);
    await db.unsafe(sqlContent);
    
    await markMigrationAsExecuted(filename);
    console.log(`✅ Migration ${filename} executada com sucesso`);
  } catch (error) {
    console.error(`❌ Erro ao executar migration ${filename}:`, error);
    throw error;
  }
};

// Função principal para executar todas as migrations
export const runMigrations = async () => {
  try {
    console.log('🚀 Iniciando execução de migrations...');
    
    // Cria a tabela de controle de migrations
    await createMigrationsTable();
    
    // Lista todos os arquivos .sql na pasta migrations
    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ordena para executar na ordem correta
    
    console.log(`📁 Encontradas ${migrationFiles.length} migrations`);
    
    // Executa cada migration que ainda não foi executada
    for (const filename of migrationFiles) {
      const isExecuted = await isMigrationExecuted(filename);
      
      if (!isExecuted) {
        await executeMigration(filename);
      } else {
        console.log(`⏭️  Migration ${filename} já foi executada, pulando...`);
      }
    }
    
    console.log('🎉 Todas as migrations foram executadas com sucesso!');
  } catch (error) {
    console.error('💥 Erro durante a execução das migrations:', error);
    process.exit(1);
  }
};

// Executa as migrations se o arquivo for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
} 