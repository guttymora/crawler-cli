import ora from 'ora';
import { writeFileSync } from 'node:fs';

import { Commander } from '../lib/commander';
import { scraper } from '../services/scraper';
import { openAI } from '../services/openai/openai';
import { buildPythonContextMarkdown } from '../services/crawler-context-scraper';

export enum PermittedLanguages {
    TYPESCRIPT = 'typescript',
    PYTHON = 'python',
}

type GenerateRequest = {
    name: string;
    resourceUrl: string;
    crawlerPath: string;
    language: PermittedLanguages;
};

type GeneratorState = {
    context: string[];
    crawlerContext: string[];
    docsSchema?: any;
    code?: string;
    improvedCode?: string;
};

const mapLangToFile = {
    [PermittedLanguages.TYPESCRIPT]: 'ts',
    [PermittedLanguages.PYTHON]: 'py',
};

const logger = (message: string) => {
    return ora({
        discardStdin: false,
        text: message,
    }).start();
};

const createCodeFile = async (data: {
    fileName: string;
    content: string;
    lang: PermittedLanguages;
}) => {
    const { fileName, content, lang } = data;
    writeFileSync(`${fileName}.${mapLangToFile[lang]}`, content, {
        encoding: 'utf8',
    });
};

const generateCrawler = async (request: GenerateRequest) => {
    const { name, resourceUrl, crawlerPath, language } = request;

    const state: GeneratorState = {
        context: [],
        crawlerContext: [],
        docsSchema: undefined,
        code: undefined,
        improvedCode: undefined,
    };
    const commander = new Commander();

    const getContext = async () => {
        const log = logger('Generating API docs context');
        const markdowns = await scraper.scrape(resourceUrl);
        state.context.push(...markdowns);
        log.stop();
    };

    const getPythonContext = async () => {
        const log = logger('Generating Python context');
        const markdown = await buildPythonContextMarkdown(crawlerPath);
        state.crawlerContext.push(markdown);
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
        const code = await openAI.getCode(
            JSON.stringify(state.docsSchema),
            state.crawlerContext.join('\n\n'),
            language
        );
        if (!code) return;
        state.code = code;
        log.stop();
        console.log('✔ Code generated successfully');
    };

    const testAndImproveCode = async () => {
        if (!state.code) {
            return console.error('Could not create code for this integration');
        }

        const log = logger('Testing and improving code');
        const code = await openAI.testAndImproveCode(
            JSON.stringify(state.docsSchema),
            state.code,
            language
        );
        if (!code) return;
        state.improvedCode = code;
        log.stop();
        console.log('✔ Code tested and improved successfully');
    };

    const writeCodeFile = async () => {
        if (!state.code) {
            return console.error('Could not create code for this integration');
        }

        const log = logger('Writing crawler code');
        await createCodeFile({
            fileName: name,
            content: state.code,
            lang: language,
        });

        if (!state.improvedCode) {
            return console.error('Could not create improved code for this integration');
        }

        await createCodeFile({
            fileName: `${name}-improved`,
            content: state.improvedCode,
            lang: language,
        });

        log.stop();
        console.log('✔ Code written successfully');
    };

    await commander
        .pipe(getContext)
        .pipe(getPythonContext)
        .pipe(getResult)
        .pipe(generateCode)
        .pipe(testAndImproveCode)
        .pipe(writeCodeFile)
        .exec();

    console.log('✔ All done!');
};

export { generateCrawler };
