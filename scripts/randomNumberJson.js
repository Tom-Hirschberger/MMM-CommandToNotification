#! /usr/bin/env node
const myArgs = process.argv.slice(2)
let MIN = -10
let MAX = 10

if (myArgs.length > 0) {
	MIN = Number(myArgs[0])
}

if (myArgs.length > 1) {
	MAX = Number(myArgs[1])
}

// eslint-disable-next-line func-style
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min
}

const number = getRandomArbitrary(MIN, MAX)
let integer = Math.sign(number) * Math.round(Math.abs(number))

if (Object.is(number, -0)) {
	integer = 0
}
const result = {}
result.integer = integer
result.float = number

// eslint-disable-next-line no-console
console.log(JSON.stringify(result))
