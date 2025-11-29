# Documentação da API no Postman

Este guia mostra como criar a documentação da API no Postman, com collection, environment, requests e publicação.

## 1) Workspace e Environment
- Crie um Workspace: “Orders Workspace”
- Crie um Environment “Local” com variáveis:
  - `baseUrl = http://localhost:3000`
  - `apiUrl = http://localhost:3001`
  - `orderId` (inicial vazio)

## 2) Collection
- Crie a Collection “Orders API”
- Adicione descrição com objetivo, modelos de dados e códigos de resposta

## 3) Requests
- `POST {{baseUrl}}/order`
  - Body (raw JSON):
    ```json
    {
      "numeroPedido": "v10089016vdb-01",
      "valorTotal": 10000,
      "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
      "items": [ { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 } ]
    }
    ```
  - Tests:
    ```javascript
    pm.test('Status 201', () => pm.response.code === 201)
    const data = pm.response.json()
    pm.environment.set('orderId', data.orderId)
    ```
- `GET {{baseUrl}}/order/list`
  - Tests:
    ```javascript
    pm.test('Status 200', () => pm.response.code === 200)
    const list = pm.response.json()
    pm.expect(Array.isArray(list)).to.be.true
    ```
- `GET {{baseUrl}}/order/{{orderId}}`
  - Tests:
    ```javascript
    pm.test('Status 200', () => pm.response.code === 200)
    ```
- `PUT {{baseUrl}}/order/{{orderId}}`
  - Body (raw JSON):
    ```json
    {
      "numeroPedido": "{{orderId}}-01",
      "valorTotal": 12000,
      "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
      "items": [ { "idItem": "2434", "quantidadeItem": 2, "valorItem": 6000 } ]
    }
    ```
  - Tests:
    ```javascript
    pm.test('Status 200', () => pm.response.code === 200)
    ```
- `DELETE {{baseUrl}}/order/{{orderId}}`
  - Tests:
    ```javascript
    pm.test('Status 204', () => pm.response.code === 204)
    ```

## 4) Publicar Documentação
- Na Collection, clique em “View in Web” ou “Publish Docs”
- Selecione o Environment “Local” para exemplos
- Adicione descrições detalhadas por endpoint (modelo de entrada/saída)

## 5) Exportar e Compartilhar
- Exporte a Collection (`.json`) e o Environment (`.json`) para reuso
- Compartilhe via link do Postman ou adicione em `docs/`

## Códigos de resposta
- `201 Created`: pedido criado
- `200 OK`: leitura/listagem/update OK
- `204 No Content`: exclusão
- `400 Bad Request`: validação
- `404 Not Found`: pedido inexistente
- `409 Conflict`: duplicidade de `orderId`
- `500 Internal Server Error`: erro inesperado

## Modelo de Entrada e Saída
- Entrada (POST/PUT): ver `README.md` em “Modelo de Dados e Mapping”
- Transformação e validação: `backend/src/routes/order.js:4-49`
- Rotas CRUD: `backend/src/routes/order.js:54-122`

## Schemas
- Request (POST/PUT `\{baseUrl\}/order`):
  ```json
  {
    "numeroPedido": "string",
    "valorTotal": 0,
    "dataCriacao": "YYYY-MM-DDTHH:mm:ss.SSSZ",
    "items": [
      {
        "idItem": "string | number",
        "quantidadeItem": 0,
        "valorItem": 0
      }
    ]
  }
  ```
- Persistência/Resposta (GET/POST/PUT):
  ```json
  {
    "orderId": "string",
    "value": 0,
    "creationDate": "YYYY-MM-DDTHH:mm:ss.SSSZ",
    "items": [
      {
        "productId": 0,
        "quantity": 0,
        "price": 0
      }
    ]
  }
  ```

## Exemplos de respostas
- POST `/order` — 201 Created
  ```json
  {
    "orderId": "v10089016vdb",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [ { "productId": 2434, "quantity": 1, "price": 1000 } ]
  }
  ```
- GET `/order/list` — 200 OK
  ```json
  [
    {
      "orderId": "v10089015vdb",
      "value": 10000,
      "creationDate": "2023-07-19T12:24:11.529Z",
      "items": [ { "productId": 2434, "quantity": 1, "price": 1000 } ]
    },
    {
      "orderId": "v10089016vdb",
      "value": 10000,
      "creationDate": "2023-07-19T12:24:11.529Z",
      "items": [ { "productId": 2434, "quantity": 1, "price": 1000 } ]
    }
  ]
  ```
- GET `/order/{orderId}` — 200 OK
  ```json
  {
    "orderId": "v10089016vdb",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [ { "productId": 2434, "quantity": 1, "price": 1000 } ]
  }
  ```
- PUT `/order/{orderId}` — 200 OK
  ```json
  {
    "orderId": "v10089016vdb",
    "value": 12000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [ { "productId": 2434, "quantity": 2, "price": 6000 } ]
  }
  ```
- DELETE `/order/{orderId}` — 204 No Content

## Exemplos de erros
- 400 Bad Request
  ```json
  { "message": "numeroPedido inválido ou ausente" }
  ```
- 404 Not Found
  ```json
  { "message": "Pedido não encontrado" }
  ```
- 409 Conflict
  ```json
  { "message": "Pedido já existe" }
  ```
- 500 Internal Server Error
  ```json
  { "message": "Erro interno", "details": "<detalhes>" }
  ```

