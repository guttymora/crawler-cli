import { input, select } from '@inquirer/prompts';

import { generateCrawler, PermittedLanguages } from '../generate/generate';

const generate = async () => {
    const name = await input({
        message: 'What is the name of your crawler?',
    });
    console.log('Crawler name:', name);

    const resourceUrl = await input({
        message: 'What resource url you want to consume?',
    });


    const language: PermittedLanguages = await select({
        message: 'Which language you want to write the code?',
        choices: [
            { name: 'TypeScript', value: PermittedLanguages.TYPESCRIPT },
            { name: 'Python', value: PermittedLanguages.PYTHON }
          ],
    });

    const crawlerPath = await input({
        message: 'What is the path to the crawler?',
    });

    // let schedule: string = await select({
    //     message: 'How often is the crawler executed?',
    //     choices: [
    //         { name: '5 min', value: '5' },
    //         { name: '10 min', value: '10' },
    //         { name: '15 min', value: '15' },
    //         { name: 'Custom', value: 'custom' },
    //     ],
    // });
    // if (schedule === 'Custom') {
    //     schedule = await input({
    //         message: 'Define the schedule in minutes',
    //     });
    // }
    // const scheduleInMinutes = Number(schedule.replace(/\D/g, ''));
    // console.log(`Schedule: ${scheduleInMinutes} minutes`);

    // const resourceUrl = 'api_docs/';
    // const language: PermittedLanguages = PermittedLanguages.PYTHON
    // const crawlerPath = '/Users/cristian.rossi/dd/crawler-sdk/';

    generateCrawler({ name, resourceUrl, crawlerPath, language });
};

export { generate };
