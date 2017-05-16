#!/usr/bin/env node
const randomfilegen = require('..'); //Your module is in the parent directory
const commander = require('commander');


var program = require('commander');

program
  .version('0.0.1')
  .option('-d, --depth <n>', 'number sub directories deep to go')
  .option('-s, --subdirs <n>', 'number of sub directories to create in each parent directory')
  .option('-f, --files <n>', ' number of files to create in each directory')
  .parse(process.argv);

console.log("Generating with options:", program);
randomfilegen(program,function(err, path){
  if(err){
    console.log("Error:");
    console.log(err);
  }else{
    console.log("Random files created here, don't forget to delete them one day!");
    console.log(path);
  }
})
