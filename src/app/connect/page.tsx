'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Twitter, Linkedin, Instagram, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConnectedAccount {
  platform: string;
  connected: boolean;
  username?: string;
}

export default function ConnectPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    { platform: 'twitter', connected: false },
    { platform: 'linkedin', connected: false },
    { platform: 'instagram', connected: false },
  ]);

  const [loading, setLoading] = useState<string | null>(null);

  const handleConnect = async (platform: string) => {
    setLoading(platform);
    try {
      window.location.href = `/api/auth/${platform}/authorize`;
    } catch (error) {
      console.error('Connection error:', error);
      setLoading(null);
    }
  };

  const handleDisconnect = async (platform: string) => {
    setLoading(platform);
    // TODO: Implement disconnect logic
    setTimeout(() => {
      setAccounts(prev =>
        prev.map(a => a.platform === platform ? { ...a, connected: false } : a)
      );
      setLoading(null);
    }, 1000);
  };

  const getPlatformInfo = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return {
          name: 'Twitter/X',
          icon: Twitter,
          color: 'text-black dark:text-white',
        };
      case 'linkedin':
        return {
          name: 'LinkedIn',
          icon: Linkedin,
          color: 'text-blue-600',
        };
      case 'instagram':
        return {
          name: 'Instagram',
          icon: Instagram,
          color: 'text-pink-600',
        };
      default:
        return { name: platform, icon: null, color: '' };
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">连接社交平台</h1>
        <p className="text-muted-foreground">连接您的账户以一键发布内容</p>
      </div>

      <div className="grid gap-4">
        {accounts.map((account) => {
          const info = getPlatformInfo(account.platform);
          const Icon = info.icon;

          return (
            <Card key={account.platform} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {Icon && <Icon className={`h-8 w-8 ${info.color}`} />}
                  <div>
                    <h3 className="font-semibold">{info.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {account.connected
                        ? `已连接${account.username ? ` as @${account.username}` : ''}`
                        : '未连接'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {account.connected ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <Button
                        variant="outline"
                        onClick={() => handleDisconnect(account.platform)}
                        disabled={loading === account.platform}
                      >
                        {loading === account.platform ? '断开中...' : '断开连接'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(account.platform)}
                      disabled={loading === account.platform}
                    >
                      {loading === account.platform ? '连接中...' : '连接'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          连接社交平台后，您可以直接从 ContentForge AI 发布内容到这些平台。
          您的数据安全存储，我们不会在未经您许可的情况下发布任何内容。
        </AlertDescription>
      </Alert>
    </div>
  );
}
