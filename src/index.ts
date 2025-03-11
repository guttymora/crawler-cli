import { Command } from 'commander';
import { input, select } from '@inquirer/prompts';

import { generate } from './generate/generate';
import { Commands } from './commands';

const program = new Command();

program.name('crawler-cli').description('Crawler CLI').version('1.0.0');

program
    .command(Commands.GENERATE)
    .description('Generate a new crawler')
    .action(async () => {
        const name = await input({
            message: 'What is the name of your crawler?',
        });
        console.log('Crawler name:', name);

        const resourceName = await input({
            message: 'What resource you want to consume?',
        });
        console.log('Resource:', resourceName);

        let schedule: string = await select({
            message: 'How often is the crawler executed?',
            choices: ['5 min', '10 min', '15 min', 'Custom'],
        });
        if (schedule === 'Custom') {
            schedule = await input({
                message: 'Define the schedule in minutes',
            });
        }
        const scheduleInMinutes = Number(schedule.replace(/\D/g, ''));
        console.log(`Schedule: ${scheduleInMinutes} minutes`);

        generate({ name, resourceName, schedule: scheduleInMinutes });
    });

program.parse(process.argv);
