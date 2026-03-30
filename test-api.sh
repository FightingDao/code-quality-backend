#!/bin/bash

# API 测试脚本
# 用于测试代码质量分析系统的所有 API 端点

BASE_URL="http://localhost:3000/api/v1"
TOKEN=""  # 如果需要认证，在此设置 JWT token

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试结果统计
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_api() {
  local method=$1
  local endpoint=$2
  local description=$3
  local data=$4

  TOTAL_TESTS=$((TOTAL_TESTS + 1))

  echo -e "\n${YELLOW}测试 $TOTAL_TESTS: $description${NC}"
  echo "端点: $method $endpoint"

  if [ -z "$TOKEN" ]; then
    auth_header=""
  else
    auth_header="-H \"Authorization: Bearer $TOKEN\""
  fi

  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint" $auth_header -H "Content-Type: application/json")
  elif [ "$method" = "POST" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" $auth_header -H "Content-Type: application/json" -d "$data")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "${GREEN}✓ 通过 (HTTP $http_code)${NC}"
    echo "响应: $(echo $body | head -c 200)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "${RED}✗ 失败 (HTTP $http_code)${NC}"
    echo "响应: $body"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
}

echo "=========================================="
echo "代码质量分析系统 API 测试"
echo "=========================================="
echo "基础 URL: $BASE_URL"
echo "测试时间: $(date)"

# ==================== 健康检查 ====================
test_api "GET" "/" "健康检查"

# ==================== 大盘视图 API ====================
echo -e "\n========== 大盘视图 API =========="

test_api "GET" "/dashboard/overview?periodType=week&periodValue=20260310" \
  "获取大盘统计数据（周维度）"

test_api "GET" "/dashboard/teams?periodType=week&periodValue=20260310" \
  "获取各小组整体分析报告"

test_api "GET" "/dashboard/analyses?periodType=week&periodValue=20260310&page=1&limit=10" \
  "获取代码分析列表（分页）"

# ==================== 小组 API ====================
echo -e "\n========== 小组 API =========="

test_api "GET" "/teams" \
  "获取小组列表"

test_api "GET" "/teams/team-001/report?periodType=week&periodValue=20260310" \
  "获取小组分析报告"

# ==================== 项目 API ====================
echo -e "\n========== 项目 API =========="

test_api "GET" "/projects" \
  "获取项目列表"

test_api "GET" "/projects/project-001/report?periodType=week&periodValue=20260310" \
  "获取项目整体分析报告"

# ==================== 用户 API ====================
echo -e "\n========== 用户 API =========="

test_api "GET" "/users/user-001/analysis?periodType=week&periodValue=20260310" \
  "获取个人代码评审详情"

# ==================== 数据写入 API ====================
echo -e "\n========== 数据写入 API（小龙虾专用） =========="

test_api "POST" "/data/sync-users" \
  "批量同步用户信息" \
  '{
    "users": [
      {
        "username": "测试用户",
        "email": "test@example.com",
        "gitUsername": "testuser"
      }
    ]
  }'

test_api "POST" "/data/analyses" \
  "批量写入代码分析数据" \
  '{
    "analyses": [
      {
        "userId": "user-001",
        "projectId": "project-001",
        "periodType": "week",
        "periodValue": "20260317",
        "commitCount": 10,
        "insertions": 500,
        "deletions": 100,
        "filesChanged": 20,
        "totalLines": 5000,
        "codeLines": 4000,
        "commentLines": 800,
        "blankLines": 200
      }
    ]
  }'

test_api "POST" "/data/calculate-statistics" \
  "触发统计计算" \
  '{
    "periodType": "week",
    "periodValue": "20260317"
  }'

# ==================== 测试结果汇总 ====================
echo -e "\n=========================================="
echo "测试结果汇总"
echo "=========================================="
echo -e "总测试数: $TOTAL_TESTS"
echo -e "${GREEN}通过: $PASSED_TESTS${NC}"
echo -e "${RED}失败: $FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "\n${GREEN}✓ 所有测试通过！${NC}"
  exit 0
else
  echo -e "\n${RED}✗ 存在失败的测试${NC}"
  exit 1
fi