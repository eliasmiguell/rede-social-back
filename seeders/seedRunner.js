import { db } from '../connect.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tabela para controlar os seeders executados
const createSeedersTable = async () => {
  try {
    await db`
      CREATE TABLE IF NOT EXISTS seeders (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Tabela de seeders criada/verificada');
  } catch (error) {
    console.error('❌ Erro ao criar tabela de seeders:', error);
    throw error;
  }
};

// Verifica se um seeder já foi executado
const isSeederExecuted = async (filename) => {
  try {
    const result = await db`SELECT id FROM seeders WHERE filename = ${filename}`;
    return result.length > 0;
  } catch (error) {
    console.error('❌ Erro ao verificar seeder:', error);
    return false;
  }
};

// Marca um seeder como executado
const markSeederAsExecuted = async (filename) => {
  try {
    await db`INSERT INTO seeders (filename) VALUES (${filename})`;
    console.log(`✅ Seeder ${filename} marcado como executado`);
  } catch (error) {
    console.error('❌ Erro ao marcar seeder como executado:', error);
    throw error;
  }
};

// Executa um seeder
const executeSeeder = async (filename) => {
  try {
    const filePath = path.join(__dirname, filename);
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    console.log(`🔄 Executando seeder: ${filename}`);
    await db.unsafe(sqlContent);
    
    await markSeederAsExecuted(filename);
    console.log(`✅ Seeder ${filename} executado com sucesso`);
  } catch (error) {
    console.error(`❌ Erro ao executar seeder ${filename}:`, error);
    throw error;
  }
};

// Função principal para executar todos os seeders
export const runSeeders = async () => {
  try {
    console.log('🌱 Iniciando execução de seeders...');
    
    // Cria a tabela de controle de seeders
    await createSeedersTable();
    
    // Lista todos os arquivos .sql na pasta seeders
    const seederFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ordena para executar na ordem correta
    
    console.log(`📁 Encontrados ${seederFiles.length} seeders`);
    
    // Executa cada seeder que ainda não foi executado
    for (const filename of seederFiles) {
      const isExecuted = await isSeederExecuted(filename);
      
      if (!isExecuted) {
        await executeSeeder(filename);
      } else {
        console.log(`⏭️  Seeder ${filename} já foi executado, pulando...`);
      }
    }
    
    console.log('🎉 Todos os seeders foram executados com sucesso!');
  } catch (error) {
    console.error('💥 Erro durante a execução dos seeders:', error);
    process.exit(1);
  }
};

// Executa os seeders se o arquivo for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeders();
} 