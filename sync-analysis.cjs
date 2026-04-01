const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();
const TEAM_ID = 'team-42e79f51';

const periodValue = process.argv[2] || '20260402';
const periodType = periodValue.length === 8 ? 'week' : 'month';

// 读取分析数据
const analysisFile = `/Users/zhangdi/work/codeCap/代码质量分析系统/analysis-output/analysis-${periodValue}.json`;
const analysisData = JSON.parse(fs.readFileSync(analysisFile, 'utf-8'));

console.log('============================================================');
console.log('同步分析数据到数据库');
console.log('============================================================');
console.log(`周期: ${periodType} ${periodValue}`);
console.log(`分析记录数: ${analysisData.analyses.length}`);

// AI 评分函数
function getAIScore(analysis) {
  const { stats, commits, taskIds } = analysis;
  let score = 7.0;
  
  if (taskIds && taskIds.length > 0) score += 0.5;
  if (taskIds && taskIds.length > 1) score += 0.3;
  
  const refactorCount = commits.filter(c => c.type === '重构').length;
  if (refactorCount > 0) score += 0.3;
  
  if (stats.insertions > 1000) score += 0.3;
  if (stats.insertions > 3000) score += 0.3;
  
  if (stats.commitCount > 30) score -= 0.5;
  if (stats.commitCount > 50) score -= 0.5;
  
  if (stats.insertions - stats.deletions < 0) score -= 0.2;
  
  return Math.min(10, Math.max(5, score));
}

function getAIReport(analysis, score) {
  const evaluation = score >= 8.5 ? '优秀' : score >= 7.5 ? '良好' : score >= 6.5 ? '一般' : '待改进';
  const issues = [];
  const advantages = [];
  
  if (analysis.stats.commitCount > 30) issues.push('提交次数过多');
  if (!analysis.taskIds || analysis.taskIds.length === 0) issues.push('缺少任务关联');
  
  if (analysis.taskIds && analysis.taskIds.length > 0) advantages.push('任务关联规范');
  if (analysis.commits.filter(c => c.type === '重构').length > 0) advantages.push('有重构意识');
  if (analysis.stats.insertions > 1000) advantages.push('代码产出量大');
  
  return `## 代码质量报告\n\n### 总体评价：${evaluation}\n\n### 评分：${score.toFixed(1)}/10\n\n### 主要问题\n${issues.length ? issues.map((i, idx) => `${idx + 1}. ${i}`).join('\n') : '1. 暂无明显问题'}\n\n### 亮点\n${advantages.length ? advantages.map((a, idx) => `${idx + 1}. ${a}`).join('\n') : '1. 按时完成任务'}`;
}

async function main() {
  // 1. 获取用户映射
  const users = await prisma.user.findMany({
    where: { teamId: TEAM_ID },
    select: { id: true, username: true, gitUsername: true, email: true }
  });
  
  const userMap = new Map();
  for (const user of users) {
    if (user.gitUsername) {
      userMap.set(user.gitUsername, user.id);
    }
    userMap.set(user.username, user.id);
    if (user.email) {
      userMap.set(user.email.split('@')[0], user.id);
    }
  }
  
  console.log(`用户映射: ${userMap.size} 个`);
  
  // 2. 获取项目映射
  const projects = await prisma.project.findMany({
    select: { id: true, name: true }
  });
  
  const projectMap = new Map();
  for (const project of projects) {
    projectMap.set(project.name, project.id);
  }
  
  console.log(`项目映射: ${projectMap.size} 个`);
  
  // 3. 删除旧数据
  console.log('\n🗑️  清理旧数据...');
  
  // 先获取要删除的分析记录ID
  const oldAnalyses = await prisma.codeAnalysis.findMany({
    where: { periodType, periodValue },
    select: { id: true }
  });
  const oldAnalysisIds = oldAnalyses.map(a => a.id);
  
  if (oldAnalysisIds.length > 0) {
    await prisma.codeReview.deleteMany({
      where: { analysisId: { in: oldAnalysisIds } }
    });
    await prisma.codeIssue.deleteMany({
      where: { analysisId: { in: oldAnalysisIds } }
    });
  }
  
  await prisma.codeAnalysis.deleteMany({
    where: { periodType, periodValue }
  });
  await prisma.teamStatistic.deleteMany({
    where: { periodType, periodValue }
  });
  await prisma.projectStatistic.deleteMany({
    where: { periodType, periodValue }
  });
  
  // 4. 同步分析数据
  console.log('\n📊 同步分析数据...');
  let synced = 0;
  let skipped = 0;
  
  for (const analysis of analysisData.analyses) {
    const gitUsername = analysis.user.username;
    let userId = userMap.get(gitUsername);
    
    // 尝试其他匹配方式
    if (!userId) {
      for (const [key, id] of userMap.entries()) {
        if (key.endsWith(gitUsername) || gitUsername.endsWith(key)) {
          userId = id;
          break;
        }
      }
    }
    
    if (!userId) {
      console.log(`  跳过用户: ${gitUsername}`);
      skipped++;
      continue;
    }
    
    // 获取或创建项目
    let projectId = projectMap.get(analysis.projectName);
    if (!projectId) {
      const newProject = await prisma.project.create({
        data: { name: analysis.projectName, repository: analysis.repository }
      });
      projectId = newProject.id;
      projectMap.set(analysis.projectName, projectId);
      console.log(`  创建项目: ${analysis.projectName}`);
    }
    
    const aiScore = getAIScore(analysis);
    const aiReport = getAIReport(analysis, aiScore);
    
    // 创建分析记录
    const newAnalysis = await prisma.codeAnalysis.create({
      data: {
        userId,
        projectId,
        periodType,
        periodValue,
        commitCount: analysis.stats.commitCount,
        insertions: analysis.stats.insertions,
        deletions: analysis.stats.deletions,
        filesChanged: analysis.stats.filesChanged,
        totalLines: 0,
        codeLines: 0,
        commentLines: 0,
        blankLines: 0,
        taskCount: analysis.stats.taskCount || 0,
        branch: analysis.branch,
        aiQualityScore: aiScore,
        aiQualityReport: aiReport,
        fileChanges: analysis.fileChanges || []
      }
    });
    
    // 创建提交记录
    for (const commit of analysis.commits) {
      await prisma.codeReview.create({
        data: {
          analysisId: newAnalysis.id,
          commitHash: commit.hash,
          commitMessage: commit.message,
          commitDate: new Date(commit.date),
          committerId: userId,
          committerName: gitUsername,
          status: 'approved',
          reviewResult: JSON.stringify({
            insertions: commit.insertions,
            deletions: commit.deletions,
            type: commit.type
          })
        }
      });
    }
    
    synced++;
  }
  
  console.log(`\n✅ 同步 ${synced} 条记录 (跳过 ${skipped} 条)`);
  
  // 5. 计算统计数据
  console.log('\n📈 计算统计数据...');
  
  const teamAnalyses = await prisma.codeAnalysis.findMany({
    where: { periodType, periodValue }
  });
  
  const activeUserIds = new Set(teamAnalyses.map(a => a.userId));
  const totalCommits = teamAnalyses.reduce((sum, a) => sum + a.commitCount, 0);
  const totalInsertions = teamAnalyses.reduce((sum, a) => sum + a.insertions, 0);
  const totalDeletions = teamAnalyses.reduce((sum, a) => sum + a.deletions, 0);
  const totalTasks = teamAnalyses.reduce((sum, a) => sum + (a.taskCount || 0), 0);
  const avgScore = teamAnalyses.length > 0 
    ? teamAnalyses.reduce((sum, a) => sum + Number(a.aiQualityScore || 0), 0) / teamAnalyses.length 
    : 0;
  
  await prisma.teamStatistic.create({
    data: {
      teamId: TEAM_ID,
      periodType,
      periodValue,
      totalMembers: users.length,
      activeMembers: activeUserIds.size,
      totalCommits,
      totalInsertions,
      totalDeletions,
      totalTasks,
      avgQualityScore: avgScore
    }
  });
  
  // 项目统计
  const projectGroups = {};
  for (const a of teamAnalyses) {
    if (!projectGroups[a.projectId]) {
      projectGroups[a.projectId] = [];
    }
    projectGroups[a.projectId].push(a);
  }
  
  for (const [projectId, analyses] of Object.entries(projectGroups)) {
    const contributors = new Set(analyses.map(a => a.userId));
    const commits = analyses.reduce((sum, a) => sum + a.commitCount, 0);
    const insertions = analyses.reduce((sum, a) => sum + a.insertions, 0);
    const deletions = analyses.reduce((sum, a) => sum + a.deletions, 0);
    const tasks = analyses.reduce((sum, a) => sum + (a.taskCount || 0), 0);
    const avgProjScore = analyses.reduce((sum, a) => sum + Number(a.aiQualityScore || 0), 0) / analyses.length;
    
    await prisma.projectStatistic.create({
      data: {
        projectId,
        periodType,
        periodValue,
        totalContributors: contributors.size,
        totalCommits: commits,
        totalInsertions: insertions,
        totalDeletions: deletions,
        totalTasks: tasks,
        totalLines: 0,
        avgQualityScore: avgProjScore
      }
    });
  }
  
  console.log('统计计算完成');
  console.log('\n✅ 全部完成！');
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('错误:', e);
  process.exit(1);
});