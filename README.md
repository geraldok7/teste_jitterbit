# Desafio Jitterbit — Orders API & Dashboard

Projeto desenvolvido para o processo seletivo da Jitterbit. Implementa uma API em Node.js (JavaScript) para gerenciamento de pedidos (CRUD) e um frontend em Next.js com dashboard moderno. Dados persistidos em MongoDB. Containers prontos com Docker Compose e ambientes de desenvolvimento via DevContainers.

## Arquitetura
- Frontend: `Next.js` (`frontend/`)
- Backend: `Express` + `MongoDB` (`backend/`)
- Banco: `mongo:6` (via `docker-compose`)
- DevContainers: `frontend/.devcontainer/` e `backend/.devcontainer/`

## Organização
- `frontend/`: Next.js (App Router) com páginas Dashboard, Pedidos, Relatórios e Configurações
- `backend/`: API Express com rotas de pedidos, validação e transformação de dados
- `docker-compose.yml`: orquestra `mongo`, `backend` e `frontend`

## Execução rápida
```bash
# Requisitos: Docker Desktop
# Na raiz do projeto
docker compose up -d --build

# Ver estados
docker compose ps

# Logs
docker compose logs backend
docker compose logs frontend
```
- Frontend: `http://localhost:3000/`
- Backend: `http://localhost:3001/`
- Health: `http://localhost:3000/health`

## Variáveis de ambiente
- `backend/.env`: `PORT`, `MONGO_URL`, `MONGO_DB`
- `frontend/.env.local`: `API_URL`

## Requisitos do desafio (resumo)
- API em Node.js/JavaScript para gerenciar pedidos (CRUD)
- Endpoints:
  - Criar: `POST http://localhost:3000/order`
  - Obter por número: `GET http://localhost:3000/order/v10089016vdb`
  - Listar: `GET http://localhost:3000/order/list`
  - Atualizar: `PUT http://localhost:3000/order/v10089016vdb`
  - Excluir: `DELETE http://localhost:3000/order/v10089016vdb`
- Persistência em banco (MongoDB, SQL ou PostgreSQL). Aqui: MongoDB.

## Modelos e transformação
Entrada (POST/PUT):
```json
{
  "numeroPedido": "v10089016vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [ { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 } ]
}
```
Persistência (transformado):
```json
{
  "orderId": "v10089016vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [ { "productId": 2434, "quantity": 1, "price": 1000 } ]
}
```
- Transformação/validação: `backend/src/routes/order.js:4-49`
- Rotas CRUD: `backend/src/routes/order.js:54-122`

## Exemplos (curl)
Criar pedido:
```bash
curl -s -X POST http://localhost:3000/order \
  -H 'Content-Type: application/json' \
  -d '{
    "numeroPedido": "v10089016vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [ { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 } ]
  }'
```
Listar pedidos:
```bash
curl -s http://localhost:3000/order/list
```
Buscar por ID:
```bash
curl -s http://localhost:3000/order/v10089016vdb
```
Atualizar pedido:
```bash
curl -s -X PUT http://localhost:3000/order/v10089016vdb \
  -H 'Content-Type: application/json' \
  -d '{
    "numeroPedido": "v10089016vdb-01",
    "valorTotal": 12000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [ { "idItem": "2434", "quantidadeItem": 2, "valorItem": 6000 } ]
  }'
```
Excluir pedido:
```bash
curl -s -X DELETE http://localhost:3000/order/v10089016vdb -i
```

## Desenvolvimento (sem Docker)
Frontend:
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```
Backend:
```bash
cd backend
npm install
npm run dev
# API em http://localhost:3001
```
MongoDB local:
- Instale localmente ou use Docker: `docker compose up -d mongo`

## DevContainers
- Abra `frontend/` ou `backend/` no VS Code e escolha “Reopen in Container”
- Dependências são instaladas automaticamente


## Códigos de resposta
- `201 Created` — criado
- `200 OK` — leitura/listagem/update OK
- `204 No Content` — exclusão
- `400 Bad Request` — validação
- `404 Not Found` — inexistente
- `409 Conflict` — duplicidade
- `500 Internal Server Error` — erro inesperado

## Extras (opcional)
- Autenticação JWT
- Swagger (`swagger-ui-express`)
- CI com lint e testes

## Como contribuir
- Abra uma issue descrevendo claramente o problema, contexto e passos para reproduzir
- Envie pull requests pequenos e focados, seguindo mensagens de commit objetivas
- Mantenha o padrão de código e organização existentes; evite introduzir libs não usadas no projeto
- Adicione testes quando alterar regras de negócio e rode lint antes do PR

## Licença
- Este projeto está licenciado sob a licença MIT. Veja `LICENSE` para detalhes.

---
Para dúvidas ou melhorias, abrir issue com contexto do endpoint e logs relevantes.
