#!/bin/bash

# ContentForge AI 快速启动脚本
# 这个脚本会帮助你快速设置和启动 ContentForge AI

set -e

echo "🚀 ContentForge AI 快速启动脚本"
echo "================================"
echo ""

# 检查 Node.js 版本
echo "📦 检查 Node.js 版本..."
NODE_VERSION=$(node -v)
echo "当前 Node.js 版本: $NODE_VERSION"

if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请访问 https://nodejs.org/ 安装 Node.js"
    exit 1
fi

echo "✅ Node.js 已安装"
echo ""

# 检查 pnpm
echo "📦 检查 pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ 错误: 未安装 pnpm"
    echo "正在安装 pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm 已安装"
echo ""

# 检查 .env 文件
echo "🔑 检查环境变量配置..."
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件"
    echo "正在从 .env.example 创建 .env 文件..."
    cp .env.example .env
    echo "✅ .env 文件已创建"
    echo ""
    echo "⚠️  重要: 你需要配置 Anthropic API 密钥才能使用 AI 功能"
    echo ""
    echo "获取步骤:"
    echo "1. 访问 https://console.anthropic.com/"
    echo "2. 注册或登录账户"
    echo "3. 在 API Keys 部分创建新的 API 密钥"
    echo "4. 复制密钥并粘贴到 .env 文件的 ANTHROPIC_API_KEY 后面"
    echo ""
    read -p "是否现在配置 API 密钥? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "请输入你的 Anthropic API 密钥: " API_KEY
        if [ -n "$API_KEY" ]; then
            sed -i "s/ANTHROPIC_API_KEY = \"\"/ANTHROPIC_API_KEY = \"$API_KEY\"/" .env
            echo "✅ API 密钥已配置"
        else
            echo "⚠️  跳过 API 密钥配置"
            echo "你可以稍后在 .env 文件中手动配置"
        fi
    fi
else
    echo "✅ .env 文件已存在"
    # 检查是否已配置 API 密钥
    if grep -q "ANTHROPIC_API_KEY = \"\"" .env; then
        echo "⚠️  警告: ANTHROPIC_API_KEY 未配置"
        echo "请在 .env 文件中配置你的 API 密钥"
    else
        echo "✅ ANTHROPIC_API_KEY 已配置"
    fi
fi

echo ""

# 安装依赖
echo "📥 安装项目依赖..."
if [ ! -d "node_modules" ]; then
    echo "首次安装，这可能需要几分钟..."
    pnpm install
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已存在"
fi

echo ""

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf .next 2>/dev/null || true
echo "✅ 清理完成"
echo ""

# 构建项目
echo "🔨 构建项目..."
pnpm build
echo "✅ 项目构建完成"
echo ""

# 启动开发服务器
echo ""
echo "🎉 准备完成！"
echo ""
echo "启动选项:"
echo "1. 开发模式 (推荐用于开发)"
echo "2. 生产模式 (推荐用于演示)"
echo ""
read -p "选择启动模式 (1 或 2): " MODE

echo ""
if [ "$MODE" = "2" ]; then
    echo "🚀 启动生产服务器..."
    echo "访问: http://localhost:3000"
    echo "内容生成页面: http://localhost:3000/generate"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    pnpm start
else
    echo "🚀 启动开发服务器..."
    echo "访问: http://localhost:3000"
    echo "内容生成页面: http://localhost:3000/generate"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    pnpm dev
fi
