'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

const platforms = [
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'in' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'newsletter', name: 'Newsletter', icon: '📧' },
];

const tones = [
  { id: 'professional', name: '专业', emoji: '💼' },
  { id: 'casual', name: '轻松', emoji: '😊' },
  { id: 'humorous', name: '幽默', emoji: '😄' },
  { id: 'formal', name: '正式', emoji: '🎩' },
];

export default function ContentGeneratePage() {
  const [input, setInput] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'linkedin']);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('请输入内容');
      return;
    }

    setLoading(true);
    setError('');
    setGenerated({});

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: input,
          platforms: selectedPlatforms,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      setGenerated(data.results || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">ContentForge AI</h1>
        <p className="text-muted-foreground">一次输入，生成所有平台的适配内容</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">1. 输入内容</h2>
          
          <div className="mb-4">
            <Label>原始内容</Label>
            <Textarea
              placeholder="粘贴文章链接、视频链接，或直接输入内容..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              className="mt-2"
            />
          </div>

          <div className="mb-4">
            <Label>选择平台</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl mr-2">{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <Label>语调风格</Label>
            <div className="flex gap-2 mt-2">
              {tones.map(tone => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedTone === tone.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {tone.emoji} {tone.name}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                开始生成
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </Card>

        {/* Output Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">2. 生成结果</h2>
          
          {Object.keys(generated).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>输入内容后点击"开始生成"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(generated).map(([platform, content]) => (
                <div key={platform} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize">
                      {platforms.find(p => p.id === platform)?.name || platform}
                    </h3>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{content}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
