# INSTITUTO FEDERAL DA PARAÍBA - IFPB
**Unidade Acadêmica de Informação e Comunicação**  
**CST em Sistemas para Internet**  
**Disciplina: Banco de Dados II**  
**Professores: Damires e Thiago**  
**Grupo: _____**

---

## Roteiro para Miniprojeto de BD baseado em Documentos (10,0)

**ATENÇÃO:** Entregar textos, diagramas e códigos através de um documento Google Docs. Os scripts para rodar devem ser também entregues em documento.js ou JSON (conjunto de dados).

---

### 1. Modelo Entidade-Relacionamento em nível Conceitual (1,0)

**a. Obrigatório ter:**
- Duas a três entidades
- Vários atributos simples
- Pelo menos um atributo multivalorado
- Pelo menos um atributo composto
- Pelo menos um atributo opcional
- Pelo menos um relacionamento 1:N com sentido de agregação ou composição (possui, tem, contém...)

**b. Opcional:**
- Hierarquia de generalização/especialização
- Relacionamentos N:N, N:1, 1:1

**Obs:**  
- Escolher duas a três entidades do projeto de BDR que atendam ao que se pede.  
- Lembrar que o modelo ER em nível conceitual INDEPENDE de tecnologia.

---

### 2. Mapeamento para coleção(ões) de documentos no MongoDB (1,0)

Preencher quadro do seu projeto como mostrado no exemplo:

#### Quadro 1: Exemplos de mapeamentos

| Modelo Conceitual (MC)     | Tipo no MC                | Tipo no MongoDB               | Observação                          |
|----------------------------|---------------------------|--------------------------------|-------------------------------------|
| Pessoa                     | Entidade                  | Coleção                        | Principal entidade do projeto       |
| Nome                       | Atributo simples          | Campo simples                  | Campo obrigatório                   |
| Telefone                   | Atributo Multivalorado    | Campo – Array                  | Campo opcional da Coleção Pessoa    |
| Endereço                   | Atributo Composto         | Campo – objeto embutido        | Campo obrigatório                   |
| Nota                       | Entidade                  | Campo array de notas           | Nota é campo obrigatório em Pessoa  |
| Possui [Nota]              | relacionamento            | Array de notas                 | Implementado via array de notas     |
| Organização                | Entidade                  | Coleção                        |                                     |
| Representa [Organização]   | relacionamento            | Referência ao id de Pessoa     | Organização possui pessoa           |

---

### 3. Implementação do projeto no MongoDB

#### a. Objetos básicos (1,5)
- **i.** Coleção(ões) de documentos: criar conforme mapeamentos (0,5)  
- **ii.** 2 índices com justificativa (1,0)

#### b. Operações de manipulação (CRUD) (6,5)
*Todas as operações devem apresentar enunciado e solução. Comandos devem fazer sentido à aplicação.*

- **i.** Pelo menos 5 comandos de inserções para cada coleção (0,5)  
- **ii.** Exportar conjunto(s) de dados (0,6)  
- **iii.** Consultas diversas (5,4):  
  - 2 consultas com filtros diversos (IN, GT, etc), sem projeção  
  - 2 consultas com filtros diversos e com projeção  
  - 1 consulta com apenas projeção (sem filtro)  
  - 1 consulta com acesso a elemento de array  
  - 1 consulta com acesso a estrutura/objeto embutido  
  - 1 consulta com sort, limit, filtros e projeções  
  - 1 consulta com aggregate e lookup  
  - 1 outra consulta a seu critério