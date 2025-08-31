// REQUISITO: CONSULTAS COM FILTROS DIVERSOS SEM PROJEÇÃO

// 1.1. Usando operador $regex
// Encontrar usuários com nome começando por G
db.usuario.find({
  nome: /^G/
})

// 1.2. Usando operador $gt
// Encontrar usuários que publicaram conteúdo para público-alvo com idade menor que 25
db.usuario.find({
  "conteudo.publico_alvo.idade": { $lt: 25 }
})



// REQUISITO: CONSULTAS COM FILTROS DIVERSOS E COM PROJEÇÃO

// 2.1. Filtrando usuários com pelo menos um telefone cadastrado
db.usuario.find(
  { telefone: { $exists: true, $ne: [] } },
  { nome: 1, telefone: 1, _id: 0 }
)

// 2.2. Filtrando usuários com conteúdo para público feminino
db.usuario.find(
  { "conteudo.publico_alvo.sexo": "F" },
  { nome: 1, conteudo: { $elemMatch: { "publico_alvo.sexo": "F" } }, _id: 0 }
)



// REQUISITO: CONSULTA COM APENAS PROJEÇÃO (SEM FILTRO) =====

// Listar todos os usuários mostrando apenas nome, nome de perfil e titulos de seus conteúdos
db.usuario.find(
  {},
  { nome: 1, nome_perfil: 1, conteudo: {titulo: 1}, _id: 0 }
)



// REQUISITO: CONSULTA COM ACESSO A ELEMENTO DE ARRAY =====

// Encontrar usuários que têm o primeiro número com DDD de Pernambuco
db.usuario.find({
  "telefone.0": /^\+55 81 / 
}, {nome: 1, telefone: 1, _id: 0})



// REQUISITO: CONSULTA COM ACESSO A ESTRUTURA/OBJETO EMBUTIDO =====

// Encontrar usuários com conteúdo destinado ao público masculino de idade maior que 20
db.usuario.find({
  "conteudo": {
    $elemMatch: {
      "publico_alvo.sexo": "M",
      "publico_alvo.idade": { $gt: 20 }
    }
  }
},
  {
    nome: 1,
    conteudo: {
      $elemMatch: {
        "publico_alvo.sexo": "M",
        "publico_alvo.idade": { $gt: 20 }
      }
    },
    _id: 0
  }
)



// REQUISITO: CONSULTA COM SORT, LIMIT, FILTROS E PROJEÇÕES

// Listar os 5 primeiros usuários que possuem algum conteudo ordenados por nome
db.usuario.find(
  { conteudo: { $exists: true, $ne: [] } },
  { nome: 1, nome_perfil: 1, conteudo: {titulo: 1}, _id: 0 }
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
    $group: {
      _id: {
        autor: "$nome",
        titulo: "$conteudo.titulo"
      },
      tags: { $addToSet: "$tag_info.nome" }
    }
  },
  {
    $project: {
      autor: "$_id.autor",
      titulo: "$_id.titulo",
      tag_nomes: {
        $reduce: {
          input: "$tags",
          initialValue: [],
          in: { $concatArrays: ["$$value", "$$this"] }
        }
      },
      _id: 0
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