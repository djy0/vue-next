const execa = require('execa')
const path = require('path')
const chalk = require('chalk')

const bin = name => path.resolve(__dirname, '../node_modules/.bin/' + name)
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })

main()

async function main() {
  await testLean()
  await testFull()
}

async function testLean() {
  process.env.LEAN = true
  console.log()
  console.log(chalk.cyan('Testing lean build'))
  await run('yarn', ['build', 'vue', '-f', 'global', '-d', '-l'])
  await run(bin('jest'), [
    'packages/vue/examples/__tests__',
    ...process.argv.slice(2)
  ])
  process.env.LEAN = false
}

async function testFull() {
  console.log()
  console.log(chalk.cyan('Testing full build'))
  await run('yarn', ['build', 'vue', '-f', 'global', '-d'])
  await run(bin('jest'), [...process.argv.slice(2)])
}
