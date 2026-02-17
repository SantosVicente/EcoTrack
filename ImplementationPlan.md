[Component] API (NestJS)
[NEW]
auth.controller.ts
Endpoints: POST /auth/login, POST /auth/refresh, POST /auth/logout.
Lógica de setar/limpar cookies HttpOnly.
[NEW]
users.module.ts
Necessário para que o AuthService possa buscar e validar o usuário no banco de dados.
Verification Plan
Automated Tests
Criar testes unitários para o AuthService.
Testar a geração e validação de tokens.
Manual Verification
Acessar /api/docs no navegador para ver o Swagger UI.
Testar o fluxo de login via Insomnia/Postman e verificar se o cookie jwt é setado com httpOnly: true.
