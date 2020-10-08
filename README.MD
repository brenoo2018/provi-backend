<p align="center">
</p>
<h3 align="center">Provi API</h3>
<p align="center">
</p>
<br>

## Provi API

Este serviço de API foi desenvolvido com a finalidade de resolver o desafio proposto pelo João da empresa Provi. O desafio era desenvolver uma api REST em Node que simule alguns dos desafios que a empresa enfrenta todos os dias.

### Ferramentas utilizadas:

- Axios
- Jest
- Bcrypt
- JWT
- Knex
- SQLite
- Uuid

## Começo rápido

- [Baixe este repositório](https://codeload.github.com/brenoo2018/provi-backend/zip/master)
- Extraia os arquivos da pasta
- Dentro da pasta, execute: `> npm install`
- Em seguida, execute: `> npx knex migrate:latest ` - para criar as migrations
- Caso queira desfazer as migrations: `> npx knex migrate:rollback --all`
- Por fim: `> npm run dev` - para o servidor inicializar
- Obs: Importe o arquivo `Insomnia_2020-10-08` em algum client api de sua peferência para testar as rotas
- [Link do desafio](https://github.com/provicapital/challenge_node)

## Rotas

| Requisição | Rota                       | Corpo                                    | Resposta | Descrição                                                         |
| ---------- | -------------------------- | ---------------------------------------- | -------- | ----------------------------------------------------------------- |
| POST       | `/users/create`            | email, password                          | `object` | Rota de criação de usuário                                        |
| POST       | `/sessions/create`         | email, password                          | `object` | Rota de login do usuário                                          |
| POST       | `/students/cpf`            | cpf                                      | `object` | Rota de criação ou atualização do cpf do usuário logado           |
| POST       | `/students/full-name`      | first_name, last_name                    | `object` | Rota de criação ou atualização do nome completo do usuário logado |
| POST       | `/students/birthday`       | birthday                                 | `object` | Rota de criação ou atualização do aniversário do usuário logado   |
| POST       | `/students/phone-number`   | phone_number                             | `object` | Rota de criação ou atualização do telefone do usuário logado      |
| POST       | `/students/address`        | cep, street,number,complement,state,city | `object` | Rota de criação ou atualização do endereço do usuário logado      |
| POST       | `/students/amount-request` | amount_request                           | `object` | Rota de criação do pedido do empréstimo do usuário logado         |

## Testes

- `npm run test -t '00_create_user.spec.js'` para realizar o teste de criação de usuário
- `npm run test -t '01_create_session.spec.js'` para realizar o teste de autenticação
- OBS: ao realizar o teste de autenticação, copiar o token do console.log e adicionar nos demais testes
- `npm run test -t '02_create_update_cpf.spec.js'` para realizar o teste de criação ou atualização do cpf
- `npm run test -t '03_create_update_fullname.spec.js'` para realizar o teste de criação ou atualização do nome completo
- `npm run test -t '04_create_update_birthday.spec.js'` para realizar o teste de criação ou atualização do aniversário
- `npm run test -t '05_create_update_phonenumber.spec.js'` para realizar o teste de criação ou atualização do telefone
- `npm run test -t '06_create_update_address.spec.js'` para realizar o teste de criação ou atualização do endereço
- `npm run test -t '07_create_amount_request.spec.js'` para realizar o teste de criação do empréstimo
