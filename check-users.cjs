const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 查询所有用户
  const users = await prisma.user.findMany({
    where: { teamId: 'team-42e79f51' },
    select: { id: true, username: true, gitUsername: true, email: true }
  });
  
  console.log('运营前端组用户数:', users.length);
  console.log('用户列表:');
  users.forEach(u => {
    console.log(`  - ${u.username} (${u.gitUsername || '无git用户名'}) - ${u.id}`);
  });
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});