/**
 * Content Generation API
 * POST /api/generate
 *
 * Generates platform-specific content using AI
 */

import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  content: string;
  platforms: string[];
  tone: string;
}

interface GenerateResponse {
  results: Record<string, string>;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

const platformPrompts: Record<string, string> = {
  twitter: 'Generate a Twitter thread (3-5 tweets) or single tweet. Keep it under 280 characters per tweet. Use appropriate hashtags.',
  linkedin: 'Generate a professional LinkedIn post. Keep it engaging but business-appropriate. Use line breaks and spacing.',
  instagram: 'Generate an Instagram caption with engaging hooks. Include relevant hashtags at the end.',
  tiktok: 'Generate a short video script for TikTok. Keep it 15-60 seconds. Include visual cues in [brackets].',
  newsletter: 'Generate a short newsletter summary. 3-5 paragraphs with a clear call-to-action.',
};

const toneModifiers: Record<string, string> = {
  professional: 'Use a professional, business-appropriate tone.',
  casual: 'Use a friendly, conversational tone.',
  humorous: 'Use humor and wit while staying appropriate.',
  formal: 'Use a formal, respectful tone.',
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { content, platforms, tone } = body;

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const results: Record<string, string> = {};

    // For each platform, generate content
    for (const platform of platforms) {
      const prompt = `
You are a content repurposing expert. Take the following content and adapt it for ${platform}.

${toneModifiers[tone] || toneModifiers.professional}

${platformPrompts[platform] || 'Adapt the content for this platform.'}

Original content:
${content}

Generate only the final adapted content, no explanations or prefixes:
`;

      try {
        // Call Anthropic Claude API
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        
        if (!anthropicKey) {
          // Fallback: mock response for demo
          results[platform] = `[Demo content for ${platform}]\n\n${content.substring(0, 200)}...`;
          continue;
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`Claude API error: ${response.statusText}`);
        }

        const data = await response.json();
        const generatedContent = data.content?.[0]?.text || 'Failed to generate content';
        
        results[platform] = generatedContent.trim();
      } catch (error) {
        console.error(`Error generating for ${platform}:`, error);
        results[platform] = `Error generating content for ${platform}`;
      }
    }

    const response: GenerateResponse = { results };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
