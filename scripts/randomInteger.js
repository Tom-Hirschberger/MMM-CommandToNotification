#! /usr/bin/env node
const myArgs = process.argv.slice(2);
let MIN=-10
let MAX=10

if (myArgs.length > 0 ) {
	MIN=Number(myArgs[0])
}

if (myArgs.length > 1 ) {
        MAX=Number(myArgs[1])
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

let number = getRandomArbitrary(MIN,MAX)
number = Math.sign(number) * Math.round(Math.abs(number))

if (Math.sign(number) === -0){
	number = 0
}

console.log(number)
