import { AIProvider } from './types';
import { OpenAIProvider } from './OpenAIProvider';
import { LocalDemoProvider } from './LocalDemoProvider';

let instance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (instance) return instance;

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    instance = new OpenAIProvider(apiKey.trim());
  } else {
    instance = new LocalDemoProvider();
  }

  return instance;
}

export function getAIProviderMode(): 'live' | 'demo' {
  return getAIProvider().getMode();
}
