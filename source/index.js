#! /usr/bin/env node
const fs = require('fs')
const path = require('path')

const { sharedIgnore } = require(path.join(process.env.PWD, 'package.json'))

if (!sharedIgnore) {
	console.warn('shared-ignore: "sharedIgnore" not found in "package.json"')
	process.exit(0)
}

const ignores = Object.entries(sharedIgnore)
	.filter(([name]) => !['all', 'options'].includes(name))
	.map(([name, rules]) => ({
		name,
		rules: [...sharedIgnore.all, ...rules],
	}))
	.map(({ name, rules }) => ({
		content: `# auto-generated by shared-ignore\n${rules.reduce(
			(a, b) => `${a}${b}\n`,
			''
		)}`,
		location: path.join(process.env.PWD, `.${name}ignore`),
		name: `.${name}ignore`,
	}))
	.forEach(({ content, location, name }) =>
		fs.writeFile(location, content, (error, data) => {
			if (error) {
				console.error(`shared-ignore: something went wrong:`)
				console.error(error)
				process.exit(1)
			}

			console.log(`shared-ignore: created ${name}`)
		})
	)
