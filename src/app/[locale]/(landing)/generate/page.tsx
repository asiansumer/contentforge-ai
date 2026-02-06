'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Loader2, Sparkles, Copy, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  maxChars: number;
  hasTags: boolean;
  hashtags: boolean;
}

interface GenerateRequest {
  platform: string;
  contentType: string;
  topic: string;
  tone: string;
  targetAudience: string;
  keywords: string[];
  length: 'short' | 'medium' | 'long';
  language: string;
}

interface GeneratedContent {
  content: string;
  hashtags: string[];
  title?: string;
  suggestions: string[];
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'weibo',
    name: '微博',
    icon: '📱',
    maxChars: 140,
    hasTags: true,
    hashtags: true,
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '📕',
    maxChars: 1000,
    hasTags: true,
    hashtags: true,
  },
  {
    id: 'douyin',
    name: '抖音',
    icon: '🎵',
    maxChars: 55,
    hasTags: true,
    hashtags: true,
  },
  {
    id: 'wechat',
    name: '微信公众号',
    icon: '💬',
    maxChars: 50000,
    hasTags: false,
    hashtags: false,
  },
  {
    id: 'zhihu',
    name: '知乎',
    icon: '🧠',
    maxChars: 10000,
    hasTags: true,
    hashtags: false,
  },
];

const CONTENT_TYPES = [
  { id: 'post', name: '文案', description: '社交媒体帖子文案' },
  { id: 'article', name: '文章', description: '长文内容' },
  { id: 'script', name: '脚本', description: '短视频脚本' },
  { id: 'product', name: '种草', description: '产品推荐' },
  { id: 'story', name: '故事', description: '品牌故事' },
];

const TONES = [
  { id: 'professional', name: '专业', emoji: '💼' },
  { id: 'casual', name: '轻松', emoji: '😊' },
  { id: 'humorous', name: '幽默', emoji: '😄' },
  { id: 'emotional', name: '情感', emoji: '❤️' },
  { id: 'urgent', name: '紧迫', emoji: '⚡' },
];

const LENGTHS = [
  { id: 'short', name: '简短', description: '50-100字' },
  { id: 'medium', name: '中等', description: '100-300字' },
  { id: 'long', name: '详细', description: '300-800字' },
];

export default function GeneratePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('xiaohongshu');
  const [contentType, setContentType] = useState<string>('post');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<string>('casual');
  const [targetAudience, setTargetAudience] = useState('');
  const [keywords, setKeywords] = useState<string>('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [language, setLanguage] = useState<string>('chinese');

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const platformConfig = PLATFORMS.find(p => p.id === selectedPlatform);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('请输入主题');
      return;
    }

    setLoading(true);
    try {
      const request: GenerateRequest = {
        platform: selectedPlatform,
        contentType,
        topic: topic.trim(),
        tone,
        targetAudience: targetAudience.trim(),
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        length,
        language,
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      setGeneratedContent(data);
      toast.success('内容生成成功！');
    } catch (error) {
      console.error('Generate error:', error);
      toast.error('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedContent) return;

    let textToCopy = generatedContent.content;
    if (generatedContent.hashtags && generatedContent.hashtags.length > 0) {
      textToCopy += '\n\n' + generatedContent.hashtags.map(tag => `#${tag}`).join(' ');
    }

    navigator.clipboard.writeText(textToCopy);
    toast.success('已复制到剪贴板');
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          内容生成器
        </h1>
        <p className="text-muted-foreground">
          AI 驱动的多平台内容生成工具，一键创作优质内容
        </p>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* 左侧：生成区域 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>创作参数</CardTitle>
              <CardDescription>配置内容生成参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 平台选择 */}
              <div className="space-y-3">
                <label className="text-sm font-medium">发布平台</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PLATFORMS.map(platform => (
                    <Button
                      key={platform.id}
                      variant={selectedPlatform === platform.id ? 'default' : 'outline'}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className="h-auto py-3 px-4 flex flex-col items-center gap-1"
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-xs">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* 内容类型 */}
              <div className="space-y-3">
                <label className="text-sm font-medium">内容类型</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 主题输入 */}
              <div className="space-y-3">
                <label className="text-sm font-medium">主题 *</label>
                <Textarea
                  placeholder="描述你想要创作的内容主题..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                  maxLength={platformConfig?.maxChars}
                />
                {platformConfig && (
                  <div className="text-xs text-muted-foreground text-right">
                    {topic.length} / {platformConfig.maxChars} 字符
                  </div>
                )}
              </div>

              {/* 语气和长度 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">语气风格</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map(t => (
                        <SelectItem key={t.id} value={t.id}>
                          <span className="mr-2">{t.emoji}</span>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">内容长度</label>
                  <Select value={length} onValueChange={(v: any) => setLength(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LENGTHS.map(l => (
                        <SelectItem key={l.id} value={l.id}>
                          <div>
                            <div className="font-medium">{l.name}</div>
                            <div className="text-xs text-muted-foreground">{l.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 目标受众和关键词 */}
              <div className="space-y-3">
                <label className="text-sm font-medium">目标受众</label>
                <Textarea
                  placeholder="例如：25-35岁的都市白领女性"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">关键词（用逗号分隔）</label>
                <Textarea
                  placeholder="例如：护肤, 美容, 日常保养"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  rows={2}
                />
              </div>

              {/* 生成按钮 */}
              <Button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    开始生成
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：结果展示 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>生成结果</CardTitle>
                  <CardDescription>预览和编辑生成的内容</CardDescription>
                </div>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleCopy}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleRegenerate} disabled={loading}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!generatedContent ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>填写左侧参数并点击生成</p>
                </div>
              ) : (
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">内容</TabsTrigger>
                    <TabsTrigger value="hashtags">标签</TabsTrigger>
                    <TabsTrigger value="suggestions">建议</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-4">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {generatedContent.content}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="hashtags" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="suggestions" className="mt-4">
                    <ul className="space-y-2">
                      {generatedContent.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* 平台特性提示 */}
          {platformConfig && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">平台特性</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">平台</span>
                    <span className="font-medium">{platformConfig.icon} {platformConfig.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">字符限制</span>
                    <span className="font-medium">{platformConfig.maxChars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">支持话题</span>
                    <span className="font-medium">{platformConfig.hasTags ? '✓' : '✗'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">支持标签</span>
                    <span className="font-medium">{platformConfig.hashtags ? '✓' : '✗'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
