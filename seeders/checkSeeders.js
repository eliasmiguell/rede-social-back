import { db } from '../connect.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para verificar o status dos seeders
export const checkSeedersStatus = async () => {
  try {
    console.log('📊 Verificando status dos seeders...\n');
    
    // Lista todos os arquivos .sql na pasta seeders
    const seederFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Busca seeders executados no banco
    const executedSeeders = await db`SELECT filename FROM seeders ORDER BY filename`;
    const executedFiles = executedSeeders.map(s => s.filename);
    
    console.log(`📁 Total de seeders encontrados: ${seederFiles.length}`);
    console.log(`✅ Seeders executados: ${executedFiles.length}\n`);
    
    console.log('📋 Status detalhado:');
    console.log('─'.repeat(60));
    
    for (const filename of seederFiles) {
      const isExecuted = executedFiles.includes(filename);
      const status = isExecuted ? '✅ Executado' : '⏳ Pendente';
      console.log(`${status} | ${filename}`);
    }
    
    console.log('─'.repeat(60));
    
    const pendingCount = seederFiles.length - executedFiles.length;
    if (pendingCount > 0) {
      console.log(`\n⚠️  ${pendingCount} seeder(s) pendente(s)`);
      console.log('Execute: npm run seed');
    } else {
      console.log('\n🎉 Todos os seeders foram executados!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar status dos seeders:', error);
  }
};

// Executa se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  checkSeedersStatus();
} 