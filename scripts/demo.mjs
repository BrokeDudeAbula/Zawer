import { spawn } from 'node:child_process'
import process from 'node:process'

const commands = [
  {
    name: 'server',
    color: '\x1b[36m',
    cwd: 'server',
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'start:dev'],
  },
  {
    name: 'client',
    color: '\x1b[35m',
    cwd: '.',
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'dev:client'],
  },
]

const reset = '\x1b[0m'
const children = []

function prefixOutput(name, color, data, stream) {
  const text = data.toString()
  const lines = text.split(/\r?\n/)

  for (const line of lines) {
    if (!line) {
      continue
    }
    stream.write(`${color}[${name}]${reset} ${line}\n`)
  }
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGINT')
    }
  }

  setTimeout(() => process.exit(code), 100)
}

for (const item of commands) {
  const child = spawn(item.command, item.args, {
    cwd: item.cwd,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: process.env,
  })

  children.push(child)

  child.stdout.on('data', (data) => prefixOutput(item.name, item.color, data, process.stdout))
  child.stderr.on('data', (data) => prefixOutput(item.name, item.color, data, process.stderr))

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${item.color}[${item.name}]${reset} exited with code ${code}`)
      shutdown(code)
    }
  })
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
