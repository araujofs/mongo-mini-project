// 2 Consultas com filtros diversos (IN, GT), sem projeção

// Encontrar todos os usuários que são editores ou admins
db.usuario.find({ nome_perfil: { $in: ["editor", "admin"] } });

// Encontrar usuários com telefones com ddd 83
db.usuario.find({ telefone: { $regex: "\\+55 83.*" } });


// ------ 2 CONSULTAS COM FILTROS DIVERSOS E COM PROJEÇÃO ------

//  Filtro por público alvo feminino, projetando nome e email
db.usuario.find(
  { "conteudo.publico_alvo.sexo": "F" },
  { nome: 1, email: 1, _id: 0 }
);

// Filtro por perfil e idade do público, projetando nome e título
db.usuario.find(
  { 
    nome_perfil: "autor", 
    "conteudo.publico_alvo.idade": { $gt: 25 } 
  },
  { nome: 1, "conteudo.titulo": 1, _id: 0 }
);


// ------ 1 CONSULTA COM APENAS PROJEÇÃO (SEM FILTRO) ------

//Apenas projeção - Listar nome e perfil de todos os usuários

db.usuario.find({}, { nome: 1, nome_perfil: 1, _id: 0 });


// ------ 1 CONSULTA COM ACESSO A ELEMENTO DE ARRAY ------

// Acesso a elemento de array - Usuários com mais de um telefone

db.usuario.find({ 
  $expr: { $gt: [{ $size: { $ifNull: ["$telefone", []] } }, 1] } 
});

