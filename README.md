# Boxpets-node

Bem-vindo ao repositório Boxpets-node! Este projeto é uma aplicação backend desenvolvida com o objetivo de gerenciar os pets em um ambiente virtual.

## Tecnologias e Stack

Neste projeto, utilizamos as seguintes tecnologias:
- **Node.js**: Um ambiente de execução JavaScript assíncrono que permite criar aplicações escaláveis e eficientes.
- **Express**: Um framework para Node.js que facilita a criação de APIs e o gerenciamento de rotas.
- **MongoDB**: Um banco de dados NoSQL que armazena dados em formato JSON, ideal para aplicações que exigem flexibilidade.
- **Mongoose**: Uma biblioteca para modelar dados do MongoDB e fornecer uma solução simples para trabalhar com o banco de dados.
- **Jest**: Um framework de teste para garantir que todas as partes da aplicação funcionem corretamente.
- **Docker**: Utilizado para empacotar a aplicação em contêineres, facilitando a implantação e o gerenciamento de dependências.

## Funcionalidades

- **Cadastro de Pets**: Permite adicionar novos pets ao sistema com informações como nome, espécie, raça e idade.
- **Listagem de Pets**: Exibe todos os pets cadastrados, com a opção de filtragem por espécie.
- **Atualização de Informações**: Possibilita a atualização dos dados de um pet já cadastrado.
- **Remoção de Pets**: Opção de remover um pet do sistema.
- **Testes Automatizados**: Inclui testes unitários e de integração para garantir a qualidade do código.

## Estrutura do Projeto

O repositório está organizado da seguinte forma:
- **/src**: Contém todo o código-fonte da aplicação.
  - **/controllers**: Controladores que gerenciam a lógica de cada rota.
  - **/models**: Modelos de dados utilizando Mongoose.
  - **/routes**: Definição das rotas da API.
  - **/tests**: Testes para a aplicação usando Jest.
- **/config**: Configurações gerais da aplicação, como conexão com o banco de dados.
- **Dockerfile**: Arquivo utilizado para construir a imagem Docker da aplicação.
- **package.json**: Lista de dependências e scripts da aplicação.

## Contribuição

Sinta-se à vontade para contribuir com o projeto! Abra uma issue ou envie um pull request com suas sugestões e melhorias.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.