import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface EnhanceRequest {
  content: string;
  hashtags: string[];
  platform: string;
  type: 'expand' | 'shorten' | 'improve' | 'changeTone';
}

interface EnhanceResponse {
  content: string;
  hashtags?: string[];
}

const ENHANCE_PROMPTS: Record<string, string> = {
  expand: '扩展这段内容，增加更多细节、例子和深度。保持原有的核心信息，但让内容更加丰富和有价值。长度增加 30-50%。',

  shorten: '精简这段内容，删除冗余和废话，保留最核心的信息。让内容更加简洁有力，字数减少 30-50%。',

  improve: '改进这段内容的质量。优化表达方式，让语言更加流畅自然、更有吸引力。修正任何语法或表达问题。保持原意不变。',

  changeTone: '调整这段内容的语气，让它更加生动有趣。适当使用emoji、表情符号和网络流行语（如果适合平台）。让内容更有亲和力。',
};

async function enhanceContent(
  content: string,
  hashtags: string[],
  platform: string,
  type: string
): Promise<EnhanceResponse> {
  const systemPrompt = `你是一位专业的内容编辑和优化专家，擅长改进社交媒体内容。

你的任务是根据用户的要求优化和改进内容。

重要规则：
1. 保持原文的核心意图和主要信息不变
2. 确保优化后的内容符合平台特性
3. 语言要自然流畅，不要生硬
4. 如果平台支持标签，保留并优化话题标签
5. 只返回优化后的 JSON 结果，不要添加任何其他说明文字
`;

  const userPrompt = `请优化以下${platform}平台的内容。

**优化类型**: ${ENHANCE_PROMPTS[type] || '改进内容'}

**原始内容**:
${content}

**原有标签**: ${hashtags.map((tag) => `#${tag}`).join(' ') || '无'}

**输出要求**:
1. 根据优化类型调整内容
2. 保留并优化话题标签（如果适用）
3. 返回 JSON 格式结果

**输出格式**（严格按照此格式）:
\`\`\`json
{
  "content": "优化后的内容",
  "hashtags": ["标签1", "标签2", "标签3"]
}
\`\`\`
`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  let responseText = '';
  for (const block of message.content) {
    if (block.type === 'text') {
      responseText += block.text;
    }
  }

  // 解析 JSON
  let jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    responseText = jsonMatch[1];
  }

  let result: EnhanceResponse;
  try {
    result = JSON.parse(responseText);
  } catch (parseError) {
    console.error('Failed to parse JSON response:', responseText);
    // 如果解析失败，返回原始内容
    result = {
      content: content,
      hashtags: hashtags,
    };
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body: EnhanceRequest = await request.json();

    // 验证必需字段
    if (!body.content || !body.type) {
      return NextResponse.json(
        { error: '缺少必需参数' },
        { status: 400 }
      );
    }

    // 验证增强类型
    if (
      !['expand', 'shorten', 'improve', 'changeTone'].includes(body.type)
    ) {
      return NextResponse.json(
        { error: '无效的增强类型' },
        { status: 400 }
      );
    }

    console.log(`Enhancing content with type: ${body.type}`);

    const result = await enhanceContent(
      body.content,
      body.hashtags || [],
      body.platform || 'generic',
      body.type
    );

    console.log('Content enhanced successfully');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Enhance API error:', error);

    let errorMessage = 'AI 优化失败';
    if (error.message?.includes('API key')) {
      errorMessage = 'API密钥配置错误';
    } else if (error.message?.includes('rate')) {
      errorMessage = '请求过于频繁，请稍后重试';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
