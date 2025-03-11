import OpenAI from 'openai';
import config from 'config';

const client = new OpenAI({
    apiKey: config.get<string>('openai.apiKey'),
});

const getSchemaPrompt = (context: string): string => `
${context}

Having the above API documentation as context, I want you to list me all the possible endpoints I could consume to 
get metrics (not logs) from their side. In the list I want the following:
- Communication protocol: http rest (with method), graphql, etc
- Full endpoint url
- authentication protocol and how to use it
- boolean to check if is. paginated request

Only reply in a json format. Avoid comments and side notes.
`;

const getCodePrompt = (context: string): string => `
${context}
With this endpoint schema specification. Write me the method(s) to consume those endpoints mocking what needs 
to be mocked and map the result to metrics following:
- Set the proper metric type: set, count, gauge, etc..
- Define a mnemonic metric name related to the third-party provider
- Based on the result, extract the proper tags to be included in each metric
- If the amount of metrics is huge, take into consideration the cardinality when creating the metrics

Only reply in typescript to allow me to copy the code and create a new file to fill it.
`;

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
        messages: [{ role: 'user', content: getSchemaPrompt(context) }],
        model: 'gpt-4o',
    });

    const { choices } = message;
    if (choices.length === 0 || !choices[0].message.content) return;

    return parseSchema(choices[0].message.content);
};

const getCode = async (context: string) => {
    const message = await client.chat.completions.create({
        messages: [{ role: 'user', content: getCodePrompt(context) }],
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
