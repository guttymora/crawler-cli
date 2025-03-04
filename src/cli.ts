import { Command } from 'commander';

const program = new Command();

program
    .name('crawler-cli')
    .description('An example CLI using Commander')
    .version('1.0.0');

program
    .command('generate')
    .description('Generate a new crawler')
    .action(() => {
        console.log(`So, you wanna create a new crawler, eh?`);
    });

program.parse(process.argv);