#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const api=require('./index.js')
program
    .option('-x, --xxx', 'this is x')
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const words=args.slice(0,-1).join(' ')
        api.add(words).then(()=>(console.log('add成功')),()=>{console.log('add失败')})
    });
program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        api.clear().then(()=>(console.log('clear成功')),()=>{console.log('clear失败')})
    });
if (process.argv.length===2){
   void api.showAll()
}
program.parse(process.argv);
