const multer = require("multer");

// Função para validar o tipo de arquivo (ajustar para filtrar tipos se necessário)
const filterTypes = {
    image: (req, file, cb) => {
        // Aceita todos os tipos de imagem (jpg, png, etc.)
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Aceita o arquivo
        } else {
            cb(new Error('Tipo de arquivo não suportado. Apenas imagens são permitidas.'), false);
        }
    }
};

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Permitir que todos os campos de banner sejam aceitos, validando por tipo de arquivo
        if (file.fieldname.startsWith('bannerShare') || file.fieldname.startsWith('moreImage') ||file.fieldname.startsWith('serviceBanner') || file.fieldname.startsWith('people')) {
            filterTypes.image(req, file, cb); // Filtra apenas arquivos de imagem
        } else {
            cb(new Error('Campo de upload desconhecido.'), false); // Campo desconhecido
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    }
});

module.exports = upload;
