# GOBARBER - BACKEND - TypeScript

![1](https://img.shields.io/badge/11.14.0-NodeJS-green?style=flat-square&logo=node.js)
![2](https://img.shields.io/badge/1.38.0-Visual%20Studio%20Code-orange?style=flat-square&logo=visual-studio-code)
![3](https://img.shields.io/badge/1.17.3-Yarn-lightblue?style=flat-square&logo=yarn)
![4](https://img.shields.io/badge/Typescript-gray?style=flat-square&logo=typescript)

> Aplicação para agendamento de serviços de barbearia.

## Install

    yarn

## Run

    yarn dev:server

## What I Used

- NodeJS (Express)
- TypeORM
- Redis
- Multer (Upload de Arquivos)
- Json Web Tokens (Autenticação JWT)
- SES Mail AWS
- Ethereal Mail
- S3 Storage AWS

## My Setup DEV

- Editor Config
- ESLint
- Prettier

## Docker

	docker run --name gobarber_postgres -e MYSQL_ROOT_PASSWORD=docker -d postgres

	docker run --name gobarber_mongodb -p 27017:27017 -d -t mongo

	docker run --name gobarber_redis 6379:6379 -d -t redis:alpine
