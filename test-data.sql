-- 测试数据 SQL 脚本

-- 清空现有数据
TRUNCATE TABLE code_reviews CASCADE;
TRUNCATE TABLE code_analyses CASCADE;
TRUNCATE TABLE team_statistics CASCADE;
TRUNCATE TABLE project_statistics CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE teams CASCADE;

-- 创建小组
INSERT INTO teams (id, name, description, created_at, updated_at) VALUES
('team-001', '运营前端组', '负责运营相关前端项目开发', NOW(), NOW()),
('team-002', '基础架构组', '负责基础框架和工具开发', NOW(), NOW());

-- 创建用户
INSERT INTO users (id, username, email, team_id, git_username, git_email, is_active, created_at, updated_at) VALUES
('user-001', '张三', 'zhangsan@example.com', 'team-001', 'zhangsan', 'zhangsan@users.noreply.github.com', true, NOW(), NOW()),
('user-002', '李四', 'lisi@example.com', 'team-001', 'lisi', 'lisi@users.noreply.github.com', true, NOW(), NOW()),
('user-003', '王五', 'wangwu@example.com', 'team-002', 'wangwu', 'wangwu@users.noreply.github.com', true, NOW(), NOW());

-- 创建项目
INSERT INTO projects (id, name, repository, team_id, tech_stack, is_active, default_branch, created_at, updated_at) VALUES
('project-001', '代码质量分析系统', 'https://github.com/example/code-quality', 'team-001', '["React", "TypeScript", "NestJS", "PostgreSQL"]'::jsonb, true, 'main', NOW(), NOW()),
('project-002', '小程序商城', 'https://github.com/example/minishop', 'team-001', '["Vue", "TypeScript", "Node.js"]'::jsonb, true, 'master', NOW(), NOW()),
('project-003', '组件库', 'https://github.com/example/component-lib', 'team-002', '["React", "TypeScript", "Storybook"]'::jsonb, true, 'main', NOW(), NOW());

-- 创建代码分析数据（本周 2026-03-10）
INSERT INTO code_analyses (
  id, user_id, project_id, period_type, period_value,
  commit_count, insertions, deletions, files_changed,
  total_lines, code_lines, comment_lines, blank_lines,
  languages, ai_quality_score, ai_quality_report, task_count,
  created_at, updated_at
) VALUES
(
  'analysis-001', 'user-001', 'project-001', 'week', '20260310',
  25, 1500, 300, 45,
  10000, 8000, 1500, 500,
  '{"TypeScript": 8000, "JavaScript": 1500, "CSS": 500}'::jsonb,
  8.5, '## 代码质量分析报告\n\n代码整体质量良好，建议增加单元测试覆盖率。', 5,
  NOW(), NOW()
),
(
  'analysis-002', 'user-002', 'project-001', 'week', '20260310',
  18, 980, 420, 32,
  8500, 6800, 1200, 500,
  '{"TypeScript": 6800, "JavaScript": 1200, "CSS": 500}'::jsonb,
  7.8, NULL, 3,
  NOW(), NOW()
),
(
  'analysis-003', 'user-003', 'project-003', 'week', '20260310',
  32, 2200, 580, 68,
  15000, 12500, 1800, 700,
  '{"TypeScript": 12500, "CSS": 2500}'::jsonb,
  9.2, '## 代码质量分析报告\n\n优秀的代码质量，注释完善，测试覆盖率高。', 8,
  NOW(), NOW()
);

-- 创建小组统计
INSERT INTO team_statistics (
  id, team_id, period_type, period_value,
  total_members, active_members, total_commits, total_insertions, total_deletions, total_tasks, avg_quality_score,
  created_at, updated_at
) VALUES
(
  'team-stat-001', 'team-001', 'week', '20260310',
  2, 2, 43, 2480, 720, 8, 8.15,
  NOW(), NOW()
),
(
  'team-stat-002', 'team-002', 'week', '20260310',
  1, 1, 32, 2200, 580, 8, 9.2,
  NOW(), NOW()
);

-- 创建项目统计
INSERT INTO project_statistics (
  id, project_id, period_type, period_value,
  total_contributors, total_commits, total_insertions, total_deletions, total_tasks, total_lines, avg_quality_score,
  created_at, updated_at
) VALUES
(
  'project-stat-001', 'project-001', 'week', '20260310',
  2, 43, 2480, 720, 8, 18500, 8.15,
  NOW(), NOW()
),
(
  'project-stat-002', 'project-003', 'week', '20260310',
  1, 32, 2200, 580, 8, 15000, 9.2,
  NOW(), NOW()
);

-- 查询验证
SELECT 'Teams' as table_name, COUNT(*) as count FROM teams
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Code Analyses', COUNT(*) FROM code_analyses
UNION ALL
SELECT 'Team Statistics', COUNT(*) FROM team_statistics
UNION ALL
SELECT 'Project Statistics', COUNT(*) FROM project_statistics;