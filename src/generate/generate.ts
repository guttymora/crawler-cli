import ora from 'ora';
import { writeFileSync } from 'node:fs';

import { Commander } from '../lib/commander';
import { scraper } from '../services/scraper';
import { openAI } from '../services/openai/openai';

type GenerateRequest = {
    name: string;
    resourceUrl: string;
};

type GeneratorState = {
    context: string[];
    docsSchema?: any;
    code?: string;
};

const logger = (message: string) => {
    return ora({
        discardStdin: false,
        text: message,
    }).start();
};

const createCodeFile = async (data: { fileName: string; content: string }) => {
    writeFileSync(`${data.fileName}.ts`, data.content, { encoding: 'utf8' });
};

const generateCrawler = async (request: GenerateRequest) => {
    const { name, resourceUrl } = request;

    const state: GeneratorState = {
        context: [],
        docsSchema: undefined,
        code: undefined,
    };
    const commander = new Commander();

    const getContext = async () => {
        const log = logger('Generating API docs context');
        const markdowns = await scraper.scrape(resourceUrl);
        state.context.push(...markdowns);
        log.stop();
    };

    const getResult = async () => {
        const log = logger('Generating AI response');
        state.docsSchema = await openAI.getEndpointsSchema(
            state.context.join('\n\n')
        );
        log.stop();
        console.log('✔ AI response generated successfully');
    };

    const generateCode = async () => {
        const log = logger('Generating code');
        const code = await openAI.getCode(JSON.stringify(state.docsSchema));
        if (!code) return;
        state.code = code;
        log.stop();
        console.log('✔ Code generated successfully');
    };

    const writeCodeFile = async () => {
        if (!state.code) {
            return console.error('Could not create code for this integration');
        }

        const log = logger('Writing crawler code');
        await createCodeFile({
            fileName: name,
            content: state.code,
        });
        log.stop();
        console.log('✔ Code written successfully');
    };

    await commander
        .pipe(getContext)
        .pipe(getResult)
        .pipe(generateCode)
        .pipe(writeCodeFile)
        .exec();

    console.log('✔ All done!');
};

export { generateCrawler };
