import { createAnthropic } from '@ai-sdk/anthropic';
import { createAzure } from '@ai-sdk/azure';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

export const modelNames = {
    'openai-4o': 'GPT4o (OpenAI)',
    'openai-4o-mini': 'GPT4o-mini (OpenAI)',
    'openai-o1-mini': 'o1-mini (OpenAI)',
    'openai-4-turbo': 'GPT4-Turbo (OpenAI)',
    'anthropic-3.5-sonnet': 'Claude 3.5 Sonnet (Anthropic)',
    'anthropic-3-haiku': 'Claude 3 Haiku (Anthropic)',
    'anthropic-3-opus': 'Claude 3 Opus (Anthropic)',
    'gemini-flash': 'Gemini 1.5 Flash (Google)',
    'gemini-pro': 'Gemini 1.5 Pro (Google)',
    'azure-openai': 'Azure OpenAI',
};

export type Providers = keyof typeof modelNames;

export const models = Object.keys(modelNames) as Providers[];

export function getModel(
    provider: Providers,
    apiKey: string,
    resourceName?: string,
    deploymentName?: string,
) {
    const openai = createOpenAI({ apiKey, compatibility: 'strict' });
    const anthropic = createAnthropic({ apiKey });
    const google = createGoogleGenerativeAI({ apiKey });

    const modelMap = {
        'openai-4o': () => openai('gpt-4o'),
        'openai-4o-mini': () => openai('gpt-4o-mini'),
        'openai-o1-mini': () => openai('o1-mini'),
        'openai-4-turbo': () => openai('gpt-4-turbo'),
        'anthropic-3.5-sonnet': () => anthropic('claude-3-5-sonnet-20241022'),
        'anthropic-3-opus': () => anthropic('claude-3-opus-20240229'),
        'anthropic-3-haiku': () => anthropic('claude-3-haiku-20240307'),
        'gemini-flash': () => google('gemini-1.5-flash'),
        'gemini-pro': () => google('gemini-1.5-pro'),
        'azure-openai': () =>
            resourceName && deploymentName
                ? createAzure({ apiKey, resourceName })(deploymentName)
                : null,
    };

    const model = modelMap[provider];
    return model ? model() : null;
}
