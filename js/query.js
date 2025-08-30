// 2 Consultas com filtros diversos (IN, GT), sem projeção

// Encontrar todos os usuários que são editores ou admins
db.usuario.find({ nome_perfil: { $in: ["editor", "admin"] } });

// Encontrar usuários com telefones da região 83
db.usuario.find({ telefone: { $regex: "\\+55 83.*" } });