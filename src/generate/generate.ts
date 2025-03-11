import ora from 'ora';
import { writeFileSync } from 'node:fs';

import { Commander } from '../lib/commander';
import { scraper } from '../services/scraper';
import { openAI } from '../services/openai';

type GenerateRequest = {
    name: string;
    resourceName: string;
    schedule: number;
};

type GeneratorState = {
    context: string[];
    docsSchema: any;
    code: string;
};

const logLoader = (message: string) => {
    return ora(message).start();
};

const createCodeFile = async (code: string) => {
    writeFileSync('crawler.ts', code, { encoding: 'utf8' });
};

const generate = async (request: GenerateRequest) => {
    const { name, resourceName, schedule } = request;

    const state: GeneratorState = {
        context: [],
        docsSchema: {},
        code: '',
    };
    const commander = new Commander();

    const getContext = async () => {
        const log = logLoader('Generating API docs context');
        const markdowns = await scraper.scrape(
            'https://docs.github.com/en/rest/copilot?apiVersion=2022-11-28'
        );
        state.context.push(...markdowns);
        log.stop();
    };

    const getResult = async () => {
        const log = logLoader('Generating AI response');
        const schema = await openAI.getEndpointsSchema(
            state.context.join('\n\n')
        );
        state.docsSchema = schema;
        log.stop();
    };

    const generateCode = async () => {
        const log = logLoader('Generating code');
        const code = await openAI.getCode(JSON.stringify(state.docsSchema));
        if (!code) return;
        state.code = code;
        log.stop();
    };

    const writeCodeFile = async () => {
        if (!state.code) {
            return console.error('Could not create code for this integration');
        }

        const log = logLoader('Writing crawler code');
        await createCodeFile(state.code);
        log.stop();
    };

    await commander
        .pipe(getContext)
        .pipe(getResult)
        .pipe(generateCode)
        .pipe(writeCodeFile)
        .exec();

    console.log('>> ALL DONE!');
};

export { generate };
