
db.createCollection("usuario", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "hash_senha", "nome_perfil"],
      properties: {
        nome: {
          bsonType: "string",
          description: "Nome completo do usuário - obrigatório"
        },
        hash_senha: {
          bsonType: "string",
          description: "Hash da senha do usuário - obrigatório"
        },
        nome_perfil: {
          bsonType: "string",
          description: "Nome de exibição do usuário - obrigatório"
        },
        email: {
          bsonType: "string",
          description: "Email do usuário - opcional"
        },
        telefone: {
          bsonType: "array",
          description: "Lista de telefones do usuário - opcional",
          items: {
            bsonType: "string"
          }
        },
        conteudo: {
          bsonType: "array",
          description: "Lista de conteúdos publicados pelo usuário",
          items: {
            bsonType: "object",
            required: ["titulo", "link", "descricao", "data_publicacao"],
            properties: {
              titulo: {
                bsonType: "string"
              },
              link: {
                bsonType: "string"
              },
              descricao: {
                bsonType: "string"
              },
              data_publicacao: {
                bsonType: "date"
              },
              publico_alvo: {
                bsonType: "object",
                properties: {
                  idade: {
                    bsonType: "int"
                  },
                  sexo: {
                    bsonType: "string",
                    enum: ["M", "F"]
                  }
                }
              },
              tag: {
                bsonType: "array",
                items: {
                  bsonType: "objectId"
                },
                uniqueItems: true
              }
            }
          }
        }
      }
    }
  }
});

db.createCollection("tag", {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'nome'
      ],
      properties: {
        nome: {
          bsonType: 'string',
          minLength: 2
        }
      }
    }
  }
});


// Índice para o campo nome na coleção tag
// Justificativa: As tags são frequentemente consultadas pelo nome para associação
// com conteúdo e para filtragem de conteúdo por categoria.
db.tag.createIndex({ nome: 1 }, { unique: true });
console.log("Índice criado para nome na coleção tag");

// Índice para nome_perfil na coleção usuario
// Justificativa: O campo nome_perfil é usado como identificador único de usuário,
// similar a um username. Este índice melhora as consultas que filtram por perfis específicos.
db.usuario.createIndex({ nome_perfil: 1 }, { unique: true });
console.log("Índice criado para nome_perfil na coleção usuario");

// Índice parcial para email (apenas quando existe)
// Justificativa: Garante que emails sejam únicos apenas quando existirem
db.usuario.createIndex(
  { email: 1 }, 
  { unique: true, partialFilterExpression: { email: { $exists: true, $type: "string" } } }
);
console.log("Índice parcial criado para email na coleção usuario");


db.tag.insertMany([
  { nome: 'banco de dados' },
  { nome: 'ti' },
  { nome: 'matemática' },
  { nome: 'desenvolvimento' },
  { nome: 'redes' },
  { nome: 'soft skills' },
  { nome: 'design' },
  { nome: 'ia' }
]);

tagsArray = db.tag.find().toArray();
tagsObj = {};
tagsArray.forEach(tag => {
  tagsObj[tag.nome] = tag._id;
});

// Inserção de usuários com conteúdos
db.usuario.insertMany([
  {
    nome: 'Arthur Silva',
    hash_senha: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
    nome_perfil: 'asilva',
    email: 'arthur.silva@example.com',
    telefone: ['+55 83 98877-1234'],
    conteudo: [
      {
        titulo: 'MongoDB Basics',
        link: 'https://example.com/mongodb',
        descricao: 'Introdução ao MongoDB',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 18, sexo: 'M' },
        tag: [tagsObj['banco de dados'], tagsObj['ti']]
      }
    ]
  },
  {
    nome: 'Beatriz Souza',
    hash_senha: '5d41402abc4b2a76b9719d911017c592',
    nome_perfil: 'beasou',
    email: 'bia.souza@example.com',
    telefone: ['+55 11 91234-5678'],
    conteudo: [
      {
        titulo: 'UX Design',
        link: 'https://example.com/ux',
        descricao: 'Noções básicas de UX',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { sexo: 'F' },
        tag: [tagsObj['design']]
      },
      {
        titulo: 'Design Patterns',
        link: 'https://example.com/patterns',
        descricao: 'Padrões de projeto em UI',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 30 },
        tag: [tagsObj['design'], tagsObj['desenvolvimento'], tagsObj['ti']]
      }
    ]
  },
  {
    nome: 'Carlos Almeida',
    hash_senha: '098f6bcd4621d373cade4e832627b4f6',
    nome_perfil: 'calmd',
    telefone: ['+55 21 97777-2222', '+55 21 93333-1111'],
    conteudo: [
      {
        titulo: 'Estatística Básica',
        link: 'https://example.com/estatistica',
        descricao: 'Probabilidade e estatística para iniciantes',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 25, sexo: 'M' },
        tag: [tagsObj['matemática']]
      }
    ]
  },
  {
    nome: 'Daniela Castro',
    hash_senha: 'ad0234829205b9033196ba818f7a872b',
    nome_perfil: 'castrodan',
    email: 'daniela.castro@example.com',
    conteudo: [
      {
        titulo: 'Redes de Computadores',
        link: 'https://example.com/redes',
        descricao: 'Modelos OSI e TCP/IP',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 20 },
        tag: [tagsObj['redes']]
      }
    ]
  },
  {
    nome: 'Eduardo Pereira',
    hash_senha: '8ad8757baa8564dc136c1e07507f4a98',
    nome_perfil: 'eduper',
    telefone: ['+55 61 95555-4444', '+55 61 97777-8888'],
    conteudo: [
      {
        titulo: 'Docker Essentials',
        link: 'https://example.com/docker',
        descricao: 'Introdução a containers',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { sexo: 'M' }
      }
    ]
  },
  {
    nome: 'Fernanda Lima',
    hash_senha: 'c4ca4238a0b923820dcc509a6f75849b',
    nome_perfil: 'limafe',
    email: 'fernanda.lima@example.com',
    conteudo: [
      {
        titulo: 'Marketing Digital',
        link: 'https://example.com/marketing',
        descricao: 'Conceitos de SEO e SEM',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 35, sexo: 'F' }
      },
      {
        titulo: 'Redação Publicitária',
        link: 'https://example.com/redacao',
        descricao: 'Escrevendo para campanhas online',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: {}
      }
    ]
  },
  {
    nome: 'Gabriel Oliveira',
    hash_senha: '45c48cce2e2d7fbdea1afc51c7c6ad26',
    nome_perfil: 'gabira',
    conteudo: [
      {
        titulo: 'Node.js Avançado',
        link: 'https://example.com/node',
        descricao: 'Backend com Express e MongoDB',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 29, sexo: 'M' },
        tag: [tagsObj['banco de dados'], tagsObj['desenvolvimento']]
      }
    ]
  },
  {
    nome: 'Helena Costa',
    hash_senha: '6512bd43d9caa6e02c990b0a82652dca',
    nome_perfil: 'helback',
    telefone: ['+55 19 91234-4444'],
    conteudo: [
      {
        titulo: 'Psicologia Organizacional',
        link: 'https://example.com/psico',
        descricao: 'Teorias sobre comportamento em empresas',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { sexo: 'F' },
        tag: [tagsObj['soft skills']]
      }
    ]
  },
  {
    nome: 'Igor Martins',
    hash_senha: 'e10adc3949ba59abbe56e057f20f883e',
    nome_perfil: 'igaoma',
    conteudo: [
      {
        titulo: 'Linux Essentials',
        link: 'https://example.com/linux',
        descricao: 'Comandos básicos do Linux',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 21, sexo: 'M' },
        tag: [tagsObj['ti']]
      },
      {
        titulo: 'Bash Avançado',
        link: 'https://example.com/bash',
        descricao: 'Scripts e automação',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        tag: [tagsObj['ti']]
      }
    ]
  },
  {
    nome: 'Juliana Mendes',
    hash_senha: '21232f297a57a5a743894a0e4a801fc3',
    nome_perfil: 'jujumen',
    email: 'juliana.m@example.com',
    conteudo: [
      {
        titulo: 'Machine Learning',
        link: 'https://example.com/ml',
        descricao: 'Introdução a modelos supervisionados',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 26, sexo: 'F' },
        tag: [tagsObj['ia']]
      }
    ]
  },
  {
    nome: 'Kauan Rocha',
    hash_senha: '098f6bcd4621d373cade4e832627b4f6',
    nome_perfil: 'kauanrock',
    conteudo: [
      {
        titulo: 'Desenvolvimento Mobile',
        link: 'https://example.com/mobile',
        descricao: 'Criando apps com Flutter',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        tag: [tagsObj['desenvolvimento']]
      }
    ]
  },
  {
    nome: 'Larissa Freitas',
    hash_senha: '900150983cd24fb0d6963f7d28e17f72',
    nome_perfil: 'lalafrei',
    telefone: ['+55 81 92222-7777'],
    conteudo: [
      {
        titulo: 'Análise de Dados',
        link: 'https://example.com/data',
        descricao: 'Introdução a Python e Pandas',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 27 }
      }
    ]
  },
  {
    nome: 'Matheus Barbosa',
    hash_senha: '827ccb0eea8a706c4c34a16891f84e7b',
    nome_perfil: 'barbsmatheus',
    conteudo: [
      {
        titulo: 'História da Computação',
        link: 'https://example.com/historia',
        descricao: 'Evolução da computação ao longo do século XX',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 19, sexo: 'M' },
        tag: [tagsObj['ti']]
      }
    ]
  },
  {
    nome: 'Natália Ribeiro',
    hash_senha: 'd8578edf8458ce06fbc5bb76a58c5ca4',
    nome_perfil: 'natlalia',
    email: 'natalia.r@example.com',
    telefone: ['+55 62 95555-9999'],
    conteudo: [
      {
        titulo: 'Big Data',
        link: 'https://example.com/bigdata',
        descricao: 'Processamento de grandes volumes de dados',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 34, sexo: 'F' }
      }
    ]
  },
  {
    nome: 'Otávio Nunes',
    hash_senha: '25d55ad283aa400af464c76d713c07ad',
    nome_perfil: 'otanunes',
    conteudo: [
      {
        titulo: 'Ciência de Redes',
        link: 'https://example.com/redes2',
        descricao: 'Análise de grafos e redes complexas',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        tag: [tagsObj['redes']]
      },
      {
        titulo: 'Visualização de Dados',
        link: 'https://example.com/viz',
        descricao: 'Dashboards interativos',
        data_publicacao: new Date('2024-05-10T00:00:00Z'),
        publico_alvo: { idade: 31 }
      }
    ]
  }
]);


// Comando para exportar os conjuntos
// mongosh --quiet --eval 'JSON.stringify(db.usuario.find().toArray())' > usuarios.json
// mongosh --quiet --eval 'JSON.stringify(db.tag.find().toArray())' > tags.json


// ========== REQUISITO: CONSULTAS COM FILTROS DIVERSOS SEM PROJEÇÃO ==========

console.log("\n1.1. Usuários com nome começando por G:");
db.usuario.find({
  nome: /^G/
});

console.log("\n1.2. Usuários com conteúdo para público-alvo com idade menor que 25:");
db.usuario.find({
  "conteudo.publico_alvo.idade": { $lt: 25 }
});


// ========== REQUISITO: CONSULTAS COM FILTROS DIVERSOS E COM PROJEÇÃO ==========

console.log("\n2.1. Nome e telefones dos usuários com telefone cadastrado:");
db.usuario.find(
  { telefone: { $exists: true, $ne: [] } },
  { nome: 1, telefone: 1, _id: 0 }
);

console.log("\n2.2. Usuários com conteúdo para público feminino:");
db.usuario.find(
  { "conteudo.publico_alvo.sexo": "F" },
  { nome: 1, conteudo: { $elemMatch: { "publico_alvo.sexo": "F" } }, _id: 0 }
);


// ========== REQUISITO: CONSULTA COM APENAS PROJEÇÃO (SEM FILTRO) ==========

console.log("\n3. Lista de todos os usuários (apenas nome, nome_perfil e títulos):");
db.usuario.find(
  {},
  { nome: 1, nome_perfil: 1, "conteudo.titulo": 1, _id: 0 }
);


// ========== REQUISITO: CONSULTA COM ACESSO A ELEMENTO DE ARRAY ==========

console.log("\n4. Usuários com primeiro telefone do DDD de Pernambuco (81):");
db.usuario.find({
  "telefone.0": /^\+55 81 / 
}, {nome: 1, telefone: 1, _id: 0});


// ========== REQUISITO: CONSULTA COM ACESSO A ESTRUTURA/OBJETO EMBUTIDO ==========

console.log("\n5. Usuários com conteúdo para homens com mais de 20 anos:");
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
});


// ========== REQUISITO: CONSULTA COM SORT, LIMIT, FILTROS E PROJEÇÕES ==========

console.log("\n6. Top 5 usuários com conteúdo (ordenados por nome):");
db.usuario.find(
  { conteudo: { $exists: true, $ne: [] } },
  { nome: 1, nome_perfil: 1, "conteudo.titulo": 1, _id: 0 }
).sort({ nome: 1 }).limit(5);


// ========== REQUISITO: CONSULTA COM AGGREGATE E LOOKUP ==========

console.log("\n7. Conteúdos com suas tags associadas:");
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
]);


// ========== REQUISITO: OUTRA CONSULTA A SEU CRITÉRIO ==========

console.log("\n8. Quantidade de conteúdos publicados por cada usuário:");
db.usuario.aggregate([
  {
    $project: {
      nome: 1,
      nome_perfil: 1,
      quantidade_conteudos: { $size: { $ifNull: ["$conteudo", []] } }
    }
  },
  { $sort: { quantidade_conteudos: -1 } }
]);