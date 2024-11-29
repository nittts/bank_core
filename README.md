# Bank-core

Core bancário simplificado para o desafio técnico.

## Stack utilizada

**Back-end:** Node, NestJS, Sequelize

**Banco de Dados:** PostgreSQL

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

## Autores

- [@Nitts](https://www.github.com/nittts)

## Referência

- [Como Instalar Docker (Windows)](https://gist.github.com/sidneyroberto/5f0b837c2d27f791fc494c164d2a7d74)
- [Como Instalar Docker (Linux)](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-pt)
