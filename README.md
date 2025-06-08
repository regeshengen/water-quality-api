# 🌊 API de Monitoramento da Qualidade da Água - IoT 🐠

## 📝 Sobre o Projeto

Esta API foi desenvolvida como parte de um trabalho acadêmico para a disciplina de **Internet das Coisas (Internet of Things)** 🌐 do Mestrado em Engenharia Informática da **Universidade da Beira Interior (UBI)** 🎓, Covilhã, Portugal.

O objetivo principal é fornecer um backend para um sistema de monitoramento da qualidade da água em tempo real. A API gerencia usuários e dispositivos (produtos), e também **lê e fornece dados de sensores armazenados em um banco de dados NoSQL (MongoDB)** 📈, permitindo a visualização e análise desses dados.

A API é construída utilizando o framework **NestJS** com **TypeScript**, seguindo as melhores práticas de desenvolvimento e arquitetura de software, e interage com bancos de dados relacionais (PostgreSQL) para gerenciamento de usuários/produtos e NoSQL (MongoDB) para dados de sensores.

## 🧑‍💻 Desenvolvedores

Este projeto foi realizado pelos seguintes alunos:

*   👨‍💻 **Reges Hengen**
*   👨‍💻 **Rodrigo Gomes**
*   👨‍💻 **Nelton Gemo**

## ✨ Funcionalidades Principais

A API atualmente implementa as seguintes funcionalidades:

*   👤 **Gerenciamento de Usuários (CRUD via PostgreSQL):**
    *   Criação de novos usuários (clientes e administradores).
    *   Autenticação de usuários via e-mail e senha usando JWT (JSON Web Tokens) 🔑.
    *   Leitura, atualização e exclusão de perfis de usuário (com restrições de acesso baseadas no tipo de usuário).
    *   Tipos de usuário: `administrator` (acesso total) e `customer` (acesso restrito aos seus próprios dados/produtos).
*   🐠 **Gerenciamento de Produtos (CRUD via PostgreSQL):**
    *   Representa os dispositivos de monitoramento (ex: aquários, sensores específicos).
    *   Criação, leitura, atualização e exclusão de produtos.
    *   Cada produto é associado a um usuário do tipo `customer`.
    *   Administradores podem gerenciar produtos de todos os clientes. Clientes podem gerenciar apenas os seus.
*   🌡️ **Leitura de Dados de Sensores (via MongoDB):**
    *   Endpoints para buscar leituras de sensores (como temperatura, pH, turbidez, nível da água) associadas a um `id_product` específico.
    *   Os dados dos sensores são armazenados e consultados em um banco de dados MongoDB, otimizado para séries temporais e dados não estruturados ou semi-estruturados.
*   🛡️ **Autenticação e Autorização:**
    *   Endpoints protegidos que requerem um token JWT válido.
    *   Controle de acesso baseado em papéis (Roles - Administrator vs. Customer) para diferentes funcionalidades.
*   📄 **Documentação da API:**
    *   Geração automática de documentação interativa via Swagger (OpenAPI) disponível em `/api-docs`.

## 🛠️ Tecnologias Utilizadas

*   **Backend:**
    *   [NestJS](https://nestjs.com/) (Framework Node.js progressivo)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   **Bancos de Dados:**
        *   [PostgreSQL](https://www.postgresql.org/) (para dados relacionais: usuários, produtos) - Gerenciado com [TypeORM](https://typeorm.io/).
        *   [MongoDB](https://www.mongodb.com/) (para dados de sensores/séries temporais) - Gerenciado com [Mongoose](https://mongoosejs.com/).
    *   [Passport.js](http://www.passportjs.org/) (com estratégias JWT para autenticação)
    *   [Class Validator](https://github.com/typestack/class-validator) & [Class Transformer](https://github.com/typestack/class-transformer) (Validação de DTOs)
    *   [Swagger (OpenAPI)](https://swagger.io/) (Documentação da API)
    *   [Docker](https://www.docker.com/) (Para fácil configuração do ambiente de desenvolvimento dos bancos de dados) 🐳
*   **Conceitos de IoT Aplicados:**
    *   Coleta de dados de múltiplos sensores.
    *   Armazenamento eficiente de dados de telemetria em banco NoSQL.
    *   Fornecimento de uma interface (via esta API) para visualização e gerenciamento dos dados relacionais e de sensores.

## 🚀 Como Executar Localmente

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão recomendada: >= 16.x)
*   [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
*   [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (para os bancos de dados PostgreSQL e MongoDB)
*   Clientes para os bancos (DBeaver, pgAdmin, MongoDB Compass) são opcionais, mas úteis.

### Passos para Configuração

1.  **Clone o Repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO_GIT]
    cd [NOME_DA_PASTA_DO_PROJETO]
    ```

2.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example` (se houver). Preencha com as credenciais dos bancos de dados (PostgreSQL e MongoDB) e segredos JWT.

    **Exemplo de `.env` para Docker Compose (Bancos):**
    ```env
    # PostgreSQL (Docker Compose)
    DB_USERNAME_DOCKER=seu_usuario_pg
    DB_PASSWORD_DOCKER=sua_senha_pg
    DB_DATABASE_DOCKER=water_quality_pg_db
    DB_PORT_DOCKER=5433

    # MongoDB (Docker Compose)
    MONGO_INITDB_ROOT_USERNAME=seu_usuario_mongo
    MONGO_INITDB_ROOT_PASSWORD=sua_senha_mongo
    MONGO_PORT_DOCKER=27017 # Porta padrão do MongoDB
    ```

    **Exemplo de `.env` para a API NestJS:**
    ```env
    # Aplicação
    PORT=3000

    # PostgreSQL
    DB_TYPE=postgres
    DB_HOST=localhost
    DB_PORT=5433
    DB_USERNAME=seu_usuario_pg
    DB_PASSWORD=sua_senha_pg
    DB_DATABASE=water_quality_pg_db

    # MongoDB
    MONGO_URI=mongodb://seu_usuario_mongo:sua_senha_mongo@localhost:27017/water_quality_sensor_db?authSource=admin
    # Ajuste 'water_quality_sensor_db' para o nome do seu banco de dados de sensores no Mongo

    # JWT
    JWT_SECRET=SUA_CHAVE_SECRETA_SUPER_FORTE
    JWT_EXPIRES_IN=3600s
    ```
    *Modifique o `docker-compose.yml` para incluir o serviço do MongoDB se ainda não o fez.*

3.  **Inicie os Contêineres dos Bancos de Dados (PostgreSQL e MongoDB):**
    Na raiz do projeto (onde está o `docker-compose.yml`):
    ```bash
    docker-compose up -d
    ```

4.  **Instale as Dependências da API:**
    ```bash
    npm install
    # ou
    # yarn install
    ```

5.  **Execute a Aplicação NestJS (Modo de Desenvolvimento):**
    ```bash
    npm run start:dev
    # ou
    # yarn start:dev
    ```

6.  **Acesse a API:**
    *   A API estará rodando em `http://localhost:3000` (ou a porta definida no seu `.env`).
    *   A documentação Swagger estará disponível em `http://localhost:3000/api-docs`.

## 📖 Documentação da API (Swagger)

Após iniciar a aplicação, a documentação interativa da API, gerada pelo Swagger (OpenAPI), pode ser acessada em:
`http://localhost:3000/api-docs` (ou a URL base da sua API implantada + `/api-docs`).

## 🛣️ Próximos Passos e Melhorias (Sugestões)

*   📈 Melhorias nos endpoints de sensores para permitir filtros mais avançados (intervalo de datas, agregação de dados).
*   🔗 Integração com dispositivos IoT reais (ex: ESP32, Raspberry Pi) para envio de dados de sensores para o MongoDB (via MQTT, HTTP, etc.).
*   ⏱️ Otimização das consultas ao MongoDB para grandes volumes de dados de séries temporais.
*   🔔 Implementação de sistema de alertas/notificações com base nos dados dos sensores.
*   🧪 Adição de testes unitários e de integração para todas as funcionalidades, incluindo as interações com MongoDB.
*   ☁️ Configuração de pipeline de CI/CD para deploy automatizado (Azure, AWS, etc.).

---