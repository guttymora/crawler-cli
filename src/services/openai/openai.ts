import OpenAI from 'openai';
import config from 'config';
import { prompts } from './prompts';
import { PermittedLanguages } from '../../generate/generate';

const client = new OpenAI({
    apiKey: config.get<string>('openai.apiKey'),
});

const parseSchema = (data: string) => {
    const match = data.match(/```json([\s\S]*?)```/);
    if (!match) return null;

    const jsonString = match[1].trim();

    return JSON.parse(jsonString);
};

const parseCode = (data: string) => {
    const match = data.match(/```typescript([\s\S]*?)```/);
    if (!match) return null;

    return match[1].trim();
};

const getEndpointsSchema = async (context: string) => {
    const message = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompts.getSchemaPrompt(context) }],
        model: 'gpt-4o',
    });

    const { choices } = message;
    if (choices.length === 0 || !choices[0].message.content) return;

    return parseSchema(choices[0].message.content);
};

const getCode = async (context: string, lang: PermittedLanguages) => {
    const message = await client.chat.completions.create({
        messages: [
            { role: 'user', content: prompts.getCodePrompt(context, lang) },
        ],
        model: 'gpt-4o',
    });

    const { choices } = message;
    if (choices.length === 0 || !choices[0].message.content) return;

    return parseCode(choices[0].message.content);
};

export const openAI = {
    getEndpointsSchema,
    getCode,
};
