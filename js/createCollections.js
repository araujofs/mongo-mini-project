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
          description: "Perfil de acesso do usuário - obrigatório",
          enum: ["admin", "editor", "autor", "moderador", "leitor"]
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
})