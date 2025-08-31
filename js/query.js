// REQUISITO: CONSULTAS COM FILTROS DIVERSOS SEM PROJEÇÃO

// 1.1. Usando operador $regex
// Encontrar usuários com telefone do DDD 83
db.usuario.find({
  telefone: { $regex: "\\+55 83" }
})

// 1.2. Usando operador $gt
// Encontrar usuários que publicaram conteúdo para público-alvo com idade maior que 25
db.usuario.find({
  "conteudo.publico_alvo.idade": { $gt: 25 }
})



// REQUISITO: CONSULTAS COM FILTROS DIVERSOS E COM PROJEÇÃO

// 2.1. Filtrando usuários com telefone cadastrado
db.usuario.find(
  { telefone: { $exists: true, $ne: [] } },
  { nome: 1, email: 1, _id: 0 }
)

// 2.2. Filtrando usuários com conteúdo para público feminino
db.usuario.find(
  { "conteudo.publico_alvo.sexo": "F" },
  { nome: 1, "conteudo.titulo": 1, _id: 0 }
)



// REQUISITO: CONSULTA COM APENAS PROJEÇÃO (SEM FILTRO) =====

// Listar todos os usuários mostrando apenas nome e nome de perfil
db.usuario.find(
  {},
  { nome: 1, nome_perfil: 1, _id: 0 }
)



// REQUISITO: CONSULTA COM ACESSO A ELEMENTO DE ARRAY =====

// Encontrar usuários que têm mais de um número de telefone
db.usuario.find({
  $expr: { $gt: [{ $size: { $ifNull: ["$telefone", []] } }, 1] }
})



// REQUISITO: CONSULTA COM ACESSO A ESTRUTURA/OBJETO EMBUTIDO =====

// Encontrar usuários com conteúdo destinado ao público masculino de idade específica
db.usuario.find({
  "conteudo": {
    $elemMatch: {
      "publico_alvo.sexo": "M",
      "publico_alvo.idade": { $exists: true }
    }
  }
})



// REQUISITO: CONSULTA COM SORT, LIMIT, FILTROS E PROJEÇÕES

// Listar os 5 primeiros usuários que possuem email, ordenados por nome
db.usuario.find(
  { email: { $exists: true } },
  { nome: 1, email: 1, nome_perfil: 1, _id: 0 }
).sort({ nome: 1 }).limit(5)



// REQUISITO: CONSULTA COM AGGREGATE E LOOKUP 

// Listar todos os conteúdos com seus nomes de tags associados
db.usuario.aggregate([
  { $unwind: "$conteudo" },
  { $unwind: { path: "$conteudo.tag", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "tag",
      localField: "conteudo.tag",
      foreignField: "_id",
      as: "tag_info"
    }
  },
  {
    $project: {
      autor: "$nome",
      titulo: "$conteudo.titulo",
      tag_nome: { $arrayElemAt: ["$tag_info.nome", 0] }
    }
  }
])



// REQUISITO: OUTRA CONSULTA A SEU CRITÉRIO 

// Encontrar a quantidade de conteúdos publicados por cada usuário
db.usuario.aggregate([
  {
    $project: {
      nome: 1,
      nome_perfil: 1,
      quantidade_conteudos: { $size: { $ifNull: ["$conteudo", []] } }
    }
  },
  { $sort: { quantidade_conteudos: -1 } }
])