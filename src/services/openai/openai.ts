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


const parseCode = (data: string, lang: PermittedLanguages) => {
    const regex =
        lang === PermittedLanguages.TYPESCRIPT
            ? /```typescript([\s\S]*?)```/
            : /```python([\s\S]*?)```/;

    const match = data.match(regex);
    if (!match) return null;

    return match[1].trim();
};

const getEndpointsSchema = async (context: string) => {
    const message = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompts.getSchemaPrompt(context) }],
        model: 'gpt-4o',
        temperature: 0, // help reduce randomness between runs
    });

    const { choices } = message;
    if (choices.length === 0 || !choices[0].message.content) return;

    return parseSchema(choices[0].message.content);
};

const getCrawlerTemplate = async (context: string, lang: PermittedLanguages) => {
    const message = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompts.getCrawlerCodePrompt(context, lang) }],
        model: 'gpt-4o',
        temperature: 0, // help reduce randomness between runs
    });

    const { choices } = message;
    if (choices.length === 0 || !choices[0].message.content) return;

    return choices[0].message.content;
};

const getCode = async (context: string, crawlerContext: string, lang: PermittedLanguages) => {
    const message = await client.chat.completions.create({
        messages: [
            { role: 'user', content: prompts.getCodePrompt(context, crawlerContext, lang) },
        ],
        model: 'gpt-4o',
        temperature: 0, // help reduce randomness between runs
    });

    const { choices } = message;
    if (choices.length === 0 || !choices[0].message.content) return;

    return parseCode(choices[0].message.content, lang);
};

const testAndImproveCode = async (schemaContext: string, codeContext: string, lang: PermittedLanguages) => {
    const message = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompts.getTestAndImproveCodePrompt(schemaContext, codeContext, lang) }],
        model: 'gpt-4o',
        // temperature: 0, // help reduce randomness between runs 
    });

    const { choices } = message;
    if (choices.length === 0 || !choices[0].message.content) return;

    return parseCode(choices[0].message.content, lang);
};

export const openAI = {
    getEndpointsSchema,
    getCrawlerTemplate,
    getCode,
    testAndImproveCode,
};
