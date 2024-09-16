import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createAzure } from '@ai-sdk/azure';
import { LanguageModel } from 'ai';

export const modelNames = {
    'openai-4o': 'GPT4o (OpenAI)',
    'openai-4o-mini': 'GPT4o-Mini (OpenAI)',
    'openai-o1-mini': 'o1-mini (OpenAI)',
    'openai-4-turbo': 'GPT4-Turbo (OpenAI)',
    'anthropic-3.5-sonnet': 'Claude 3.5 Sonnet (Anthropic)',
    'anthropic-3-haiku': 'Claude 3 Haiku (Anthropic)',
    'anthropic-3-opus': 'Claude 3 Opus (Anthropic)',
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

    const modelMap: { [P in Providers]: () => LanguageModel | null } = {
        'openai-4o': () => openai('gpt-4o'),
        'openai-4o-mini': () => openai('gpt-4o-mini'),
        'openai-o1-mini': () => openai('o1-mini'),
        'openai-4-turbo': () => openai('gpt-4-turbo'),
        'anthropic-3.5-sonnet': () => anthropic('claude-3-5-sonnet-20240620'),
        'anthropic-3-opus': () => anthropic('claude-3-opus-20240229'),
        'anthropic-3-haiku': () => anthropic('claude-3-haiku-20240307'),
        'azure-openai': () =>
            resourceName && deploymentName
                ? createAzure({ apiKey, resourceName })(deploymentName)
                : null,
    };

    const model = modelMap[provider];
    return model ? model() : null;
}
