// Índice para o campo nome na coleção tag
// justificativa: As tags são frequentemente consultadas pelo nome 
db.tag.createIndex({ nome: 1 }, { unique: true });


// Índice para nome_perfil na coleção usuario
// Justificativa: O campo nome_perfil é usado como identificador 
db.usuario.createIndex({ nome_perfil: 1 }, { unique: true });