import { Command } from 'commander';

import { Commands } from './commands';
import { Actions } from './actions';

const program = new Command();

program.name('crawler-cli').description('Crawler CLI').version('1.0.0');

program
    .command(Commands.GENERATE)
    .description('Generate a new crawler')
    .action(Actions.generate);

program.parse(process.argv);
