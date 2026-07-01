// Cria/atualiza usuários padrão: ADMIN, VENDEDOR e CLIENTE.
// Rodar (no servidor, dentro da pasta do projeto):
//   git pull && docker compose exec -T api node < api/prisma/create-users.js
// Senhas usam argon2 (mesmo hash do login). Idempotente: pode rodar quantas vezes quiser.

const { PrismaClient } = require('@prisma/client')
const argon2 = require('argon2')

const prisma = new PrismaClient()

const users = [
  { name: 'Administrador', email: 'admin@kite360.com',    password: 'Admin@123',    isAdmin: true },
  { name: 'Vendedor Teste', email: 'vendedor@kite360.com', password: 'Vendedor@123', isAdmin: false },
  { name: 'Cliente Teste',  email: 'cliente@kite360.com',  password: 'Cliente@123',  isAdmin: false },
]

async function main() {
  for (const u of users) {
    const passwordHash = await argon2.hash(u.password)
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash,
        isAdmin: u.isAdmin,
        isVerified: true,
        emailVerifiedAt: new Date(),
        isBanned: false,
      },
      create: {
        name: u.name,
        email: u.email,
        passwordHash,
        isAdmin: u.isAdmin,
        isVerified: true,
        emailVerifiedAt: new Date(),
      },
    })
    console.log(`OK  ${u.isAdmin ? 'ADMIN   ' : 'usuario '} ${user.email}  (senha: ${u.password})`)
  }
  console.log('\nConcluido.')
}

main()
  .catch((e) => {
    console.error('ERRO:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
