/**
 * 平台适配器 - 处理不同社交媒体平台的特殊格式和需求
 */

export interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  maxChars: number;
  hasTags: boolean;
  hashtags: boolean;
  supportsEmoji: boolean;
  supportsMarkdown: boolean;
  imageSupport: boolean;
  videoSupport: boolean;
  specialFormatting?: string;
}

export interface ContentFormat {
  content: string;
  hashtags: string[];
  metadata?: Record<string, any>;
}

export class PlatformAdapter {
  private config: PlatformConfig;

  constructor(config: PlatformConfig) {
    this.config = config;
  }

  /**
   * 格式化内容以适应特定平台
   */
  formatContent(content: string, hashtags: string[] = []): ContentFormat {
    let formattedContent = content;

    // 字符限制检查
    if (formattedContent.length > this.config.maxChars) {
      formattedContent = this.truncateContent(
        formattedContent,
        this.config.maxChars
      );
    }

    // 添加标签
    const formattedHashtags = this.formatHashtags(hashtags);

    return {
      content: formattedContent,
      hashtags: formattedHashtags,
      metadata: this.generateMetadata(formattedContent, formattedHashtags),
    };
  }

  /**
   * 截断内容以适应字符限制
   */
  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }

    // 尝试在句号、换行或空格处截断
    const truncationIndex = Math.max(0, maxLength - 3); // 留出 "..." 的空间
    let truncated = content.substring(0, truncationIndex);

    // 寻找最近的标点符号或空格
    const lastPunctuation = Math.max(
      truncated.lastIndexOf('。'),
      truncated.lastIndexOf('！'),
      truncated.lastIndexOf('？'),
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?'),
      truncated.lastIndexOf('\n'),
      truncated.lastIndexOf(' ')
    );

    if (lastPunctuation > truncationIndex * 0.8) {
      // 如果在合理范围内找到了截断点，就在那里截断
      truncated = content.substring(0, lastPunctuation + 1);
    }

    return truncated + '...';
  }

  /**
   * 格式化标签
   */
  private formatHashtags(hashtags: string[]): string[] {
    if (!this.config.hashtags) {
      return [];
    }

    // 根据平台特性调整标签数量
    const maxHashtags = this.getMaxHashtags();
    return hashtags.slice(0, maxHashtags);
  }

  /**
   * 获取平台支持的最大标签数量
   */
  private getMaxHashtags(): number {
    switch (this.config.id) {
      case 'weibo':
        return 5;
      case 'xiaohongshu':
        return 10;
      case 'douyin':
        return 6;
      case 'wechat':
        return 0;
      case 'zhihu':
        return 5;
      default:
        return 5;
    }
  }

  /**
   * 生成平台特定的元数据
   */
  private generateMetadata(
    content: string,
    hashtags: string[]
  ): Record<string, any> {
    const metadata: Record<string, any> = {
      platform: this.config.id,
      charCount: content.length,
      wordCount: content.trim() ? content.trim().split(/\s+/).length : 0,
      hashtagCount: hashtags.length,
    };

    // 平台特定的元数据
    switch (this.config.id) {
      case 'xiaohongshu':
        metadata.title = this.extractTitle(content);
        metadata.emojiCount = this.countEmoji(content);
        break;

      case 'douyin':
        metadata.hook = this.extractHook(content);
        break;

      case 'wechat':
        metadata.hasTitle = content.includes('\n');
        metadata.paragraphCount = content.split('\n\n').length;
        break;
    }

    return metadata;
  }

  /**
   * 提取标题（小红书）
   */
  private extractTitle(content: string): string | null {
    const lines = content.split('\n');
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length > 0 && firstLine.length < 50) {
        return firstLine;
      }
    }
    return null;
  }

  /**
   * 统计 emoji 数量
   */
  private countEmoji(content: string): number {
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    const matches = content.match(emojiRegex);
    return matches ? matches.length : 0;
  }

  /**
   * 提取吸引点（抖音）
   */
  private extractHook(content: string): string | null {
    const lines = content.split('\n');
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length > 0 && firstLine.length < 30) {
        return firstLine;
      }
    }
    return null;
  }

  /**
   * 验证内容是否符合平台要求
   */
  validateContent(content: string, hashtags: string[] = []): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查字符限制
    if (content.length > this.config.maxChars) {
      errors.push(
        `内容超出字符限制：${content.length} / ${this.config.maxChars}`
      );
    }

    // 检查标签数量
    const maxHashtags = this.getMaxHashtags();
    if (hashtags.length > maxHashtags) {
      warnings.push(
        `标签数量过多：${hashtags.length} 个（建议不超过 ${maxHashtags} 个）`
      );
    }

    // 平台特定的验证
    switch (this.config.id) {
      case 'xiaohongshu':
        if (!content.includes('\n')) {
          warnings.push('小红书内容建议分段以提高可读性');
        }
        if (this.countEmoji(content) < 2) {
          warnings.push('小红书内容建议适当使用 emoji 增加吸引力');
        }
        break;

      case 'douyin':
        const firstLine = content.split('\n')[0];
        if (firstLine.length > 30) {
          warnings.push('抖音开头建议简洁有力，前30字要抓住注意力');
        }
        break;

      case 'wechat':
        if (content.length < 300) {
          warnings.push('微信公众号文章通常需要至少300字');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

/**
 * 平台配置工厂
 */
export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  weibo: {
    id: 'weibo',
    name: '微博',
    icon: '📱',
    maxChars: 140,
    hasTags: true,
    hashtags: true,
    supportsEmoji: true,
    supportsMarkdown: false,
    imageSupport: true,
    videoSupport: true,
    specialFormatting: '简洁、快速、话题标签',
  },
  xiaohongshu: {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '📕',
    maxChars: 1000,
    hasTags: true,
    hashtags: true,
    supportsEmoji: true,
    supportsMarkdown: false,
    imageSupport: true,
    videoSupport: true,
    specialFormatting: '使用emoji、分段、吸引眼球的标题',
  },
  douyin: {
    id: 'douyin',
    name: '抖音',
    icon: '🎵',
    maxChars: 55,
    hasTags: true,
    hashtags: true,
    supportsEmoji: true,
    supportsMarkdown: false,
    imageSupport: false,
    videoSupport: true,
    specialFormatting: '简洁有力、开头抓住注意力、使用热门音乐提示',
  },
  wechat: {
    id: 'wechat',
    name: '微信公众号',
    icon: '💬',
    maxChars: 50000,
    hasTags: false,
    hashtags: false,
    supportsEmoji: true,
    supportsMarkdown: true,
    imageSupport: true,
    videoSupport: true,
    specialFormatting: '文章格式、有标题、分段、可使用markdown',
  },
  zhihu: {
    id: 'zhihu',
    name: '知乎',
    icon: '🧠',
    maxChars: 10000,
    hasTags: true,
    hashtags: false,
    supportsEmoji: false,
    supportsMarkdown: true,
    imageSupport: true,
    videoSupport: true,
    specialFormatting: '专业、有深度、可使用markdown、结构清晰',
  },
};

/**
 * 获取平台适配器
 */
export function getPlatformAdapter(platformId: string): PlatformAdapter {
  const config = PLATFORM_CONFIGS[platformId];
  if (!config) {
    throw new Error(`Unsupported platform: ${platformId}`);
  }
  return new PlatformAdapter(config);
}

/**
 * 获取所有平台配置
 */
export function getAllPlatforms(): PlatformConfig[] {
  return Object.values(PLATFORM_CONFIGS);
}
