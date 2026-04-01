const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.codeAnalysis.count({
    where: { periodType: 'week', periodValue: '20260402' }
  });
  console.log('本周分析记录数:', count);
  
  const list = await prisma.codeAnalysis.findMany({
    where: { periodType: 'week', periodValue: '20260402' },
    select: { id: true, userId: true, projectId: true }
  });
  
  console.log('记录详情:');
  list.forEach(a => {
    console.log(`  ${a.id}: user=${a.userId}, project=${a.projectId}`);
  });
  
  await prisma.$disconnect();
}

main();