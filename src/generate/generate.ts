import ora from 'ora';
import { writeFileSync } from 'node:fs';

import { Commander } from '../lib/commander';
import { scraper } from '../services/scraper';
import { openAI } from '../services/openai/openai';
import { readFilesContent } from '../services/read-files';

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
    crawlerTemplate?: any;
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
        crawlerTemplate: undefined,
        code: undefined,
        improvedCode: undefined,
    };
    const commander = new Commander();

    const readSchemaFromDocs = async () => {
        const log = logger('Scraping API docs');
        const markdowns = await readFilesContent(resourceUrl);
        state.context.push(...markdowns);
        log.stop();
    };

    const scrapeSchemaFromDocs = async () => {
        const log = logger('Reading scraped API docs');
        const markdowns = await scraper.scrape(resourceUrl);
        state.context.push(...markdowns);
        log.stop();
    };

    const readCrawlerFromDocs = async () => {
        const log = logger('Reading context from crawler example code');
        const markdowns = await readFilesContent(crawlerPath);
        state.crawlerContext.push(...markdowns);
        log.stop();
    };

    const generateSchema = async () => {
        const log = logger('Generating schema from scrapped docs');
        state.docsSchema = await openAI.getEndpointsSchema(
            state.context.join('\n\n')
        );

        if (state.docsSchema) {
            await createCodeFile({
                fileName: `${name}-schema`,
                content: JSON.stringify(state.docsSchema),
                lang: language,
            });
        }
        log.stop();
        console.log('✔ AI response generated successfully');
    };

    const generateCrawlerTemplate = async () => {
        const log = logger('Generating crawler template from scrapped docs');
        state.crawlerTemplate = await openAI.getCrawlerTemplate(
            state.crawlerContext.join('\n\n'),
            language
        );

        if (state.crawlerTemplate) {
            await createCodeFile({
                fileName: `${name}-crawler-template`,
                content: state.crawlerTemplate,
                lang: language,
            });
        } else {
            log.fail('Could not generate crawler template');
        }
        log.stop();
        console.log('✔ Crawler template generated successfully');
    };

    const generateCode = async () => {
        const log = logger('Generating code');
        const code = await openAI.getCode(
            JSON.stringify(state.docsSchema),
            state.crawlerTemplate,
            language
        );
        if (!code) {
            return console.error('Could not create code for this integration');
        }
        state.code = code;

        await createCodeFile({
            fileName: `${name}-crawler`,
            content: state.code,
            lang: language,
        });

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
        
        if (!code) {
            return console.error('Could not create improved code for this integration');
        }

        state.improvedCode = code;

        await createCodeFile({
            fileName: `${name}-improved-crawler`,
            content: state.improvedCode,
            lang: language,
        });

        log.stop();
        console.log('✔ Code tested and improved successfully');
    };

    await commander
        .pipe(readSchemaFromDocs)
        .pipe(readCrawlerFromDocs)
        .pipe(generateSchema)
        .pipe(generateCrawlerTemplate)
        .pipe(generateCode)
        .pipe(testAndImproveCode)
        .exec();

    console.log('✔ All done!');
};

export { generateCrawler };
