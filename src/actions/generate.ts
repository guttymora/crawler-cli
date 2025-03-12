import { input, select } from '@inquirer/prompts';

import { generateCrawler } from '../generate/generate';

const generate = async () => {
    const name = await input({
        message: 'What is the name of your crawler?',
    });
    console.log('Crawler name:', name);

    const resourceUrl = await input({
        message: 'What resource url you want to consume, baby?',
    });

    // let schedule: string = await select({
    //     message: 'How often is the crawler executed?',
    //     choices: ['5 min', '10 min', '15 min', 'Custom'],
    // });
    // if (schedule === 'Custom') {
    //     schedule = await input({
    //         message: 'Define the schedule in minutes',
    //     });
    // }
    // const scheduleInMinutes = Number(schedule.replace(/\D/g, ''));
    // console.log(`Schedule: ${scheduleInMinutes} minutes`);

    generateCrawler({ name, resourceUrl });
};

export { generate };
