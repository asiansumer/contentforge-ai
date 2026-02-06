'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Copy,
  Download,
  Save,
  Undo,
  Redo,
  Sparkles,
  Hash,
  Type,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentEditorProps {
  initialContent?: string;
  initialHashtags?: string[];
  platform: string;
  maxChars?: number;
  onSave?: (content: string, hashtags: string[]) => void;
}

interface HistoryState {
  content: string;
  hashtags: string[];
}

export function ContentEditor({
  initialContent = '',
  initialHashtags = [],
  platform,
  maxChars = 1000,
  onSave,
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [hashtags, setHashtags] = useState<string[]>(initialHashtags);
  const [newTag, setNewTag] = useState('');
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('edit');

  // 保存历史记录
  useEffect(() => {
    if (content !== initialContent || hashtags !== initialHashtags) {
      const newState: HistoryState = { content, hashtags };
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [content, hashtags]);

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleAddTag = () => {
    const tag = newTag.trim().replace(/^#/, '');
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleCopy = () => {
    let textToCopy = content;
    if (hashtags.length > 0) {
      textToCopy += '\n\n' + hashtags.map(tag => `#${tag}`).join(' ');
    }
    navigator.clipboard.writeText(textToCopy);
    toast.success('已复制到剪贴板');
  };

  const handleDownload = () => {
    let textToDownload = content;
    if (hashtags.length > 0) {
      textToDownload += '\n\n' + hashtags.map(tag => `#${tag}`).join(' ');
    }

    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${platform}-content-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('已下载');
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content, hashtags);
      toast.success('已保存');
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setContent(prevState.content);
      setHashtags(prevState.hashtags);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setContent(nextState.content);
      setHashtags(nextState.hashtags);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleReset = () => {
    setContent(initialContent);
    setHashtags(initialHashtags);
    toast.success('已重置');
  };

  const charCount = content.length;
  const charPercentage = Math.min((charCount / maxChars) * 100, 100);
  const isOverLimit = charCount > maxChars;

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // AI 增强功能（调用 API 优化内容）
  const handleAIEnhance = async (type: 'expand' | 'shorten' | 'improve' | 'changeTone') => {
    try {
      toast.loading('AI 正在优化...', { id: 'ai-enhance' });

      const response = await fetch('/api/generate/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          hashtags,
          platform,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('优化失败');
      }

      const data = await response.json();

      if (data.content) {
        setContent(data.content);
      }
      if (data.hashtags) {
        setHashtags(data.hashtags);
      }

      toast.success('AI 优化完成', { id: 'ai-enhance' });
    } catch (error) {
      console.error('AI enhance error:', error);
      toast.error('优化失败，请重试', { id: 'ai-enhance' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>内容编辑器</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="撤销"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="重做"
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              title="重置"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button variant="outline" size="icon" onClick={handleCopy} title="复制">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload} title="下载">
              <Download className="w-4 h-4" />
            </Button>
            {onSave && (
              <Button size="icon" onClick={handleSave} title="保存">
                <Save className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="edit">
              <Type className="w-4 h-4 mr-2" />
              编辑
            </TabsTrigger>
            <TabsTrigger value="hashtags">
              <Hash className="w-4 h-4 mr-2" />
              标签
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="w-4 h-4 mr-2" />
              AI 优化
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>内容</Label>
                <div className="flex items-center gap-4 text-sm">
                  <span className={isOverLimit ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                    {charCount} / {maxChars} 字符
                  </span>
                  <span className="text-muted-foreground">
                    {wordCount} 词
                  </span>
                </div>
              </div>

              {/* 字符计数进度条 */}
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isOverLimit
                      ? 'bg-destructive'
                      : charPercentage > 90
                      ? 'bg-yellow-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${charPercentage}%` }}
                />
              </div>

              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="在此输入内容..."
                rows={12}
                className={`resize-none ${isOverLimit ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
            </div>

            {isOverLimit && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
                <X className="w-4 h-4" />
                内容超出字符限制 {charCount - maxChars} 个字符
              </div>
            )}
          </TabsContent>

          <TabsContent value="hashtags" className="mt-4 space-y-4">
            <div className="space-y-3">
              <Label>话题标签</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="输入标签名称..."
                />
                <Button onClick={handleAddTag} size="icon">
                  <Check className="w-4 h-4" />
                </Button>
              </div>

              {hashtags.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-4 border rounded-lg min-h-[100px]">
                  {hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                  暂无标签，添加一个吧！
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                已添加 {hashtags.length} 个标签
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-4 space-y-4">
            <div className="space-y-3">
              <Label>AI 优化工具</Label>
              <p className="text-sm text-muted-foreground">
                使用 AI 来改进你的内容，让它更加吸引人
              </p>

              <div className="grid gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAIEnhance('expand')}
                  className="justify-start"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  扩展内容 - 增加更多细节
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleAIEnhance('shorten')}
                  className="justify-start"
                >
                  <Type className="w-4 h-4 mr-2" />
                  精简内容 - 保留核心信息
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleAIEnhance('improve')}
                  className="justify-start"
                >
                  <Check className="w-4 h-4 mr-2" />
                  改进质量 - 优化表达
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleAIEnhance('changeTone')}
                  className="justify-start"
                >
                  <Hash className="w-4 h-4 mr-2" />
                  调整语气 - 改变风格
                </Button>
              </div>

              <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                💡 提示：AI 优化会保留原始意图，但会根据选择的选项进行相应调整
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
