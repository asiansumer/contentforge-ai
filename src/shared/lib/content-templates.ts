/**
 * 内容模板系统 - 预设模板提高内容生成效率
 */

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  contentType: string;
  template: string;
  variables: TemplateVariable[];
  exampleOutput?: string;
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  options?: string[];
  required: boolean;
  placeholder?: string;
}

/**
 * 预设模板库
 */
export const CONTENT_TEMPLATES: ContentTemplate[] = [
  // 小红书模板
  {
    id: 'xhs-product-review',
    name: '产品种草',
    description: '推荐和评价产品，适合美妆、护肤、生活用品等',
    category: 'ecommerce',
    platform: 'xiaohongshu',
    contentType: 'product',
    template: `{{productName}} 真的绝了！✨

{产品特点描述}

使用感受：
{{usageExperience}}

推荐理由：
{{recommendationReason}}

价格：{{price}}
性价比：{{valueForMoney}}

#{{category}} #{{productName}} #好物推荐 #种草`,
    variables: [
      {
        name: 'productName',
        description: '产品名称',
        type: 'text',
        required: true,
        placeholder: '例如：雅诗兰黛小棕瓶',
      },
      {
        name: 'category',
        description: '产品分类',
        type: 'select',
        options: ['护肤', '美妆', '生活', '美食', '服饰', '数码'],
        required: true,
      },
      {
        name: 'usageExperience',
        description: '使用感受',
        type: 'textarea',
        required: true,
        placeholder: '描述你的使用体验...',
      },
      {
        name: 'recommendationReason',
        description: '推荐理由',
        type: 'textarea',
        required: true,
        placeholder: '为什么要推荐这个产品...',
      },
      {
        name: 'price',
        description: '价格',
        type: 'text',
        required: false,
        placeholder: '例如：¥299',
      },
      {
        name: 'valueForMoney',
        description: '性价比',
        type: 'select',
        options: ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐', '⭐'],
        required: true,
      },
    ],
    exampleOutput:
      '雅诗兰黛小棕瓶 真的绝了！✨\n\n抗氧化效果很好，用了一周皮肤明显变亮了。\n\n使用感受：\n质地清爽不油腻，吸收很快，晚上用完第二天皮肤状态很好。\n\n推荐理由：\n性价比高，大牌保证，适合熬夜党。\n\n价格：¥560\n性价比：⭐⭐⭐⭐⭐',
  },
  {
    id: 'xhs-daily-share',
    name: '日常分享',
    description: '分享日常生活和心情',
    category: 'lifestyle',
    platform: 'xiaohongshu',
    contentType: 'post',
    template: `今日份小确幸 💕

{{dailyContent}}

{{mood}}

#日常分享 #生活记录 #vlog日常`,
    variables: [
      {
        name: 'dailyContent',
        description: '分享内容',
        type: 'textarea',
        required: true,
        placeholder: '今天发生了什么...',
      },
      {
        name: 'mood',
        description: '心情',
        type: 'select',
        options: ['😊 开心', '🥰 幸福', '😴 累但满足', '💪 充实', '🌟 期待'],
        required: true,
      },
    ],
  },
  // 抖音模板
  {
    id: 'dy-product-promo',
    name: '短视频带货',
    description: '抖音短视频产品推广脚本',
    category: 'ecommerce',
    platform: 'douyin',
    contentType: 'script',
    template: `【开场】
{{hook}} 🔥

【产品介绍】
{{productIntro}}

【使用演示】
{{usageDemo}}

【价格引导】
原价{{originalPrice}}，现在只要{{currentPrice}}！

【行动号召】
点击小黄车，立即抢购！👇

#{{productName}} #好物推荐 #抖音好物`,
    variables: [
      {
        name: 'hook',
        description: '吸引点（前3秒）',
        type: 'text',
        required: true,
        placeholder: '发现一个宝藏好物！',
      },
      {
        name: 'productIntro',
        description: '产品介绍',
        type: 'textarea',
        required: true,
      },
      {
        name: 'usageDemo',
        description: '使用演示',
        type: 'textarea',
        required: true,
      },
      {
        name: 'originalPrice',
        description: '原价',
        type: 'text',
        required: true,
      },
      {
        name: 'currentPrice',
        description: '现价',
        type: 'text',
        required: true,
      },
      {
        name: 'productName',
        description: '产品名称',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'dy-knowledge',
    name: '知识科普',
    description: '科普知识类短视频',
    category: 'education',
    platform: 'douyin',
    contentType: 'script',
    template: `{{knowledgeTitle}}

你绝对想不到！{{hook}}

{{knowledgeContent}}

收藏起来慢慢看！👍

#科普 #冷知识 #涨知识`,
    variables: [
      {
        name: 'knowledgeTitle',
        description: '知识标题',
        type: 'text',
        required: true,
      },
      {
        name: 'hook',
        description: '吸引点',
        type: 'text',
        required: true,
      },
      {
        name: 'knowledgeContent',
        description: '知识内容',
        type: 'textarea',
        required: true,
      },
    ],
  },
  // 微博模板
  {
    id: 'wb-hot-comment',
    name: '热点评论',
    description: '对热点事件的评论',
    category: 'news',
    platform: 'weibo',
    contentType: 'post',
    template: `{{eventName}}

{{opinion}}

{{hashtag}}

#{{hotTopic}}`,
    variables: [
      {
        name: 'eventName',
        description: '事件名称',
        type: 'text',
        required: true,
      },
      {
        name: 'opinion',
        description: '观点',
        type: 'textarea',
        required: true,
      },
      {
        name: 'hotTopic',
        description: '相关话题',
        type: 'text',
        required: true,
      },
      {
        name: 'hashtag',
        description: '个人标签',
        type: 'text',
        required: false,
      },
    ],
  },
  // 微信公众号模板
  {
    id: 'wx-industry-analysis',
    name: '行业分析',
    description: '深度行业分析文章',
    category: 'business',
    platform: 'wechat',
    contentType: 'article',
    template: `# {{title}}

## 引言
{{introduction}}

## 行业现状
{{currentStatus}}

## 主要趋势
{{trends}}

## 深度分析
{{analysis}}

## 结论与展望
{{conclusion}}

---
*作者：{{author}}*
*来源：{{source}}*`,
    variables: [
      {
        name: 'title',
        description: '文章标题',
        type: 'text',
        required: true,
      },
      {
        name: 'introduction',
        description: '引言',
        type: 'textarea',
        required: true,
      },
      {
        name: 'currentStatus',
        description: '行业现状',
        type: 'textarea',
        required: true,
      },
      {
        name: 'trends',
        description: '主要趋势',
        type: 'textarea',
        required: true,
      },
      {
        name: 'analysis',
        description: '深度分析',
        type: 'textarea',
        required: true,
      },
      {
        name: 'conclusion',
        description: '结论与展望',
        type: 'textarea',
        required: true,
      },
      {
        name: 'author',
        description: '作者',
        type: 'text',
        required: false,
      },
      {
        name: 'source',
        description: '来源',
        type: 'text',
        required: false,
      },
    ],
  },
  // 知乎模板
  {
    id: 'zh-professional-answer',
    name: '专业回答',
    description: '知乎问题专业回答',
    category: 'qanda',
    platform: 'zhihu',
    contentType: 'article',
    template: `谢邀。

{{summary}}

{{detailedAnswer}}

{{supplement}}

{{conclusion}}

（如果觉得有帮助，请点赞支持！）`,
    variables: [
      {
        name: 'summary',
        description: '简要回答',
        type: 'textarea',
        required: true,
      },
      {
        name: 'detailedAnswer',
        description: '详细回答',
        type: 'textarea',
        required: true,
      },
      {
        name: 'supplement',
        description: '补充说明',
        type: 'textarea',
        required: false,
      },
      {
        name: 'conclusion',
        description: '总结',
        type: 'textarea',
        required: false,
      },
    ],
  },
];

/**
 * 模板服务类
 */
export class TemplateService {
  /**
   * 获取所有模板
   */
  static getAllTemplates(): ContentTemplate[] {
    return CONTENT_TEMPLATES;
  }

  /**
   * 根据平台获取模板
   */
  static getTemplatesByPlatform(platform: string): ContentTemplate[] {
    return CONTENT_TEMPLATES.filter((t) => t.platform === platform);
  }

  /**
   * 根据分类获取模板
   */
  static getTemplatesByCategory(category: string): ContentTemplate[] {
    return CONTENT_TEMPLATES.filter((t) => t.category === category);
  }

  /**
   * 根据 ID 获取模板
   */
  static getTemplateById(id: string): ContentTemplate | undefined {
    return CONTENT_TEMPLATES.find((t) => t.id === id);
  }

  /**
   * 填充模板变量
   */
  static fillTemplate(
    template: ContentTemplate,
    values: Record<string, string>
  ): string {
    let content = template.template;

    template.variables.forEach((variable) => {
      const value = values[variable.name] || '';
      const regex = new RegExp(`{{${variable.name}}}`, 'g');
      content = content.replace(regex, value);
    });

    return content;
  }

  /**
   * 验证模板变量
   */
  static validateTemplateVariables(
    template: ContentTemplate,
    values: Record<string, string>
  ): {
    valid: boolean;
    missing: string[];
  } {
    const missing: string[] = [];

    template.variables.forEach((variable) => {
      if (variable.required && !values[variable.name]) {
        missing.push(variable.description || variable.name);
      }
    });

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * 获取所有分类
   */
  static getAllCategories(): string[] {
    const categories = new Set(CONTENT_TEMPLATES.map((t) => t.category));
    return Array.from(categories);
  }
}

/**
 * 模板变量到生成参数的转换
 */
export function templateToGenerateParams(
  template: ContentTemplate,
  values: Record<string, string>
): {
  topic: string;
  tone: string;
  targetAudience: string;
  keywords: string[];
} {
  // 根据模板类型推断参数
  return {
    topic: values.topic || values.productName || values.dailyContent || '',
    tone: 'casual',
    targetAudience: '',
    keywords: [],
  };
}
