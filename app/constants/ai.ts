import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { models } from './schemas';
import { createAzure } from '@ai-sdk/azure';

type Providers = (typeof models)[number];

export function getModel(
    provider: Providers,
    apiKey: string,
    resourceName?: string,
    deploymentName?: string,
) {
    if (provider === 'openai-4o') {
        const openai = createOpenAI({ apiKey, compatibility: 'strict' });
        const model = openai('gpt-4o');
        return model;
    } else if (provider === 'openai-4o-mini') {
        const openai = createOpenAI({ apiKey, compatibility: 'strict' });
        const model = openai('gpt-4o-mini');
        return model;
    } else if (provider === 'openai-4-turbo') {
        const openai = createOpenAI({ apiKey, compatibility: 'strict' });
        const model = openai('gpt-4-turbo');
        return model;
    } else if (provider === 'anthropic-3.5-sonnet') {
        const anthropic = createAnthropic({ apiKey });
        const model = anthropic('claude-3-5-sonnet-20240620');
        return model;
    } else if (provider === 'anthropic-3-opus') {
        const anthropic = createAnthropic({ apiKey });
        const model = anthropic('claude-3-opus-20240229');
        return model;
    } else if (provider === 'anthropic-3-haiku') {
        const anthropic = createAnthropic({ apiKey });
        const model = anthropic('claude-3-haiku-20240307');
        return model;
    } else if (provider === 'azure-openai' && resourceName && deploymentName) {
        const azure = createAzure({ apiKey, resourceName });
        const model = azure(deploymentName);
        return model;
    }
}
