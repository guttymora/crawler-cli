"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .name('crawler-cli')
    .description('An example CLI using Commander')
    .version('1.0.0');
program
    .command('hello <name>')
    .description('Print a greeting')
    .action((name) => {
    console.log(`Hello, ${name}!`);
});
program.parse(process.argv);
