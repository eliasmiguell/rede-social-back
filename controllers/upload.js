import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Para ES modules - obtém o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho absoluto para o diretório de upload
// Se está em controllers/, vai para ../public/upload
const uploadDir = path.resolve(__dirname, '..', 'public', 'upload');

console.log('Diretório de upload:', uploadDir); // Debug

// Verifica se o diretório existe, se não existir, cria
if (!fs.existsSync(uploadDir)) {
  console.log('Criando diretório:', uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
} else {
  console.log('Diretório já existe:', uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Garante que o diretório existe antes de salvar
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log('Salvando arquivo em:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Gera nome único para evitar conflitos
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_'); // Remove caracteres especiais
    const filename = Date.now() + '_' + name + ext;
    console.log('Nome do arquivo:', filename);
    cb(null, filename);
  }
});

// Adiciona validação de tipos de arquivo
const fileFilter = (req, file, cb) => {
  console.log('Verificando tipo de arquivo:', file.mimetype); // Debug
  // Aceita apenas imagens
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

export const uploadController = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'Nenhum arquivo foi enviado' 
      });
    }

    const file = req.file;
    
    // Verifica se o arquivo foi realmente salvo
    if (fs.existsSync(file.path)) {
      console.log('✅ Arquivo salvo com sucesso:', file.path);
    } else {
      console.error('❌ Arquivo não encontrado:', file.path);
      return res.status(500).json({ 
        error: 'Erro ao salvar arquivo no sistema' 
      });
    }

    // Constrói a URL que o frontend pode usar
    const protocol = req.protocol; // http ou https
    const host = req.get('host'); // localhost:3000 ou seu domínio
    const fileUrl = `${protocol}://${host}/uploads/${file.filename}`;

    // Retorna apenas o filename como string
    // O frontend pode construir a URL: http://localhost:3000/uploads/${filename}
    return res.status(200).json(file.filename);

  } catch (error) {
    console.error('Erro no upload:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor ao processar upload',
      message: error.message 
    });
  }
};