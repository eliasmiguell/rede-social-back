import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config()


// Usar DATABASE_URL se disponível, senão usar configurações individuais
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

export const db = postgres(connectionString, {
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

async function testConnection() {
  try {
    const result = await db`SELECT 1`;
    console.log('Conexão ao banco de dados bem-sucedida!', result);
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

testConnection();
