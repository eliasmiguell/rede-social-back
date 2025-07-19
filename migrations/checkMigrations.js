import { db } from '../connect.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para verificar o status das migrations
export const checkMigrationsStatus = async () => {
  try {
    console.log('📊 Verificando status das migrations...\n');
    
    // Lista todos os arquivos .sql na pasta migrations
    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Busca migrations executadas no banco
    const executedMigrations = await db`SELECT filename FROM migrations ORDER BY filename`;
    const executedFiles = executedMigrations.map(m => m.filename);
    
    console.log(`📁 Total de migrations encontradas: ${migrationFiles.length}`);
    console.log(`✅ Migrations executadas: ${executedFiles.length}\n`);
    
    console.log('📋 Status detalhado:');
    console.log('─'.repeat(60));
    
    for (const filename of migrationFiles) {
      const isExecuted = executedFiles.includes(filename);
      const status = isExecuted ? '✅ Executada' : '⏳ Pendente';
      console.log(`${status} | ${filename}`);
    }
    
    console.log('─'.repeat(60));
    
    const pendingCount = migrationFiles.length - executedFiles.length;
    if (pendingCount > 0) {
      console.log(`\n⚠️  ${pendingCount} migration(s) pendente(s)`);
      console.log('Execute: npm run migrate');
    } else {
      console.log('\n🎉 Todas as migrations foram executadas!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar status das migrations:', error);
  }
};

// Executa se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  checkMigrationsStatus();
} 