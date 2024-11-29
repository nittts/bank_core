# Bank-core

Core bancário simplificado para o desafio técnico.

## Stack utilizada

**Back-end:** Node, NestJS, Sequelize

**Banco de Dados:** PostgreSQL

## Descrição

Aplicação desenvolvida seguindo estrutura e práticas de DDD, seguindo a seguinte estrutura:

.
├── src
├── modules (englobando e agrupando os dominios e seus agregados relacionados)
│   ├── ...
│   │   ├── application (agrupamento dos serviços (casos de uso) do dominio)
│   │   ├── domain (agrupamento da entidade, enums, objetos de valor e interfaces de cada dominio)
│   │   ├── infrastructure (models do ORM(sequelize) e implementações da interface de repositório descritas no dominio)
│   │   ├── interfaces (agrupamento de conexões externas, DTOs de comunicação e mappers de normalização do dominio)
├── shared (módulos, exceções, tipos, configurações, decorators, utils, utilizados pela aplicação)
├── tests
│   ├── \_mocks (mocks de entidades para utilização dentro da aplicação)
│   ├── application (testes relacionados aos serviços (casos de uso))

- A aplicação consta com autenticação via JWT, utilizando-se do documento e senha cadastrados em cada cadastro de cliente.
- Providênciando documentação via endpoint /api com suas definições.
- Incluido logs durante cada execução de conciliação das movimentações para auditoria futura.


## Rodando localmente

Clone o projeto

```bash
  git clone git@github.com:nittts/bank_core.git
```

Entre no diretório do projeto

```bash
  cd bank-core
```

### Desenvolvimento:

Entre no diretório

```bash
  cd bank-core
```

Instale as dependências

```bash
  yarn install
```

Inicie o servidor

```bash
  yarn dev
```

## Testes:

Entre no diretório

```bash
  cd bank-core
```

Execute o comando de validação

```bash
  yarn test
```

## Deploy

Para fazer o deploy desse projeto rode na pasta raiz:

```bash
  docker-compose build
```

Para realizar a criação das imagens, após isso rode:

```bash
  docker-compose up
```

Para iniciar o servidor

> **Warning**
> Crie e preencha o arquivo .env com os exemplos passados em ./env.example antes de executar

## Autores

- [@Nitts](https://www.github.com/nittts)

## Referência

- [Como Instalar Docker (Windows)](https://gist.github.com/sidneyroberto/5f0b837c2d27f791fc494c164d2a7d74)
- [Como Instalar Docker (Linux)](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-pt)
