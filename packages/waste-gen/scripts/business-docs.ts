// scripts/generate-business-doc.ts

import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
import * as dotenv from 'dotenv'
import { OpenAI } from 'openai'

dotenv.config()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const aggregateName = process.argv[2]
if (!aggregateName) {
  console.error('❌ Provide an aggregate name, e.g.: treatment')
  process.exit(1)
}

const baseDir = path.resolve(`Core/${aggregateName}`)
const domainPath = path.join(baseDir, 'domain.ts')
const constrainPath = path.join(baseDir, '_implementation', 'constrain.ts')

if (!fs.existsSync(domainPath)) throw new Error(`Missing: ${domainPath}`)
if (!fs.existsSync(constrainPath)) throw new Error(`Missing: ${constrainPath}`)

const domainSrc = fs.readFileSync(domainPath, 'utf-8')
const constraintSrc = fs.readFileSync(constrainPath, 'utf-8')
const domainFile = ts.createSourceFile(domainPath, domainSrc, ts.ScriptTarget.Latest, true)

type Message = { kind: 'cmd' | 'evt'; name: string; full: string }
const messages: Message[] = []
const states = new Set<string>()

function collect(node: ts.Node) {
  if (
    ts.isTypeAliasDeclaration(node) &&
    node.type &&
    ts.isTypeReferenceNode(node.type) &&
    ['CMD', 'EVT'].includes(node.type.typeName.getText())
  ) {
    const kind = node.type.typeName.getText() === 'CMD' ? 'cmd' : 'evt'
    messages.push({ kind, name: node.name.text, full: node.getText() })
  }

  if (ts.isTypeAliasDeclaration(node) && node.name.text === 'Treatment') {
    const body = node.getText()
    const matches = body.match(/_tag:\s*'(\w+)'/g)
    matches?.forEach(m => states.add(m.split("'")[1]))
  }

  ts.forEachChild(node, collect)
}
collect(domainFile)

const cmdNames = messages.filter(m => m.kind === 'cmd').map(m => m.name)
const evtNames = messages.filter(m => m.kind === 'evt').map(m => m.name)

const failMatches = [...constraintSrc.matchAll(/fail\('(.+?)'/g)].map(m => m[1])
const byWorkflow = constraintSrc.match(/case\s+'(.+?)':[\s\S]*?applyConstrains\(\[(.*?)\]/g) || []

const constraintsByWf = byWorkflow.map(line => {
  const [, wf, list] = line.match(/case\s+'(.+?)':[\s\S]*?\[\s*([\s\S]*?)\]/) || []
  const functions = list?.split(',').map(f => f.trim()).filter(Boolean)
  return { wf, functions }
})

async function askAI(prompt: string, temp = 0.4) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: temp,
    messages: [{ role: 'user', content: prompt }],
  })
  return res.choices[0]?.message?.content?.trim() ?? ''
}

async function run() {
  const out: string[] = []

  out.push(`# 🏥 ${aggregateName.charAt(0).toUpperCase() + aggregateName.slice(1)} — Business Documentation\n`)
  out.push(`## 📦 Lifecycle States\n`)
  states.forEach(tag => out.push(`- \`${tag}\``))
  out.push('\n---\n')

  out.push(`## 🟦 Command Catalog\n`)
  for (const m of messages.filter(m => m.kind === 'cmd')) {
    const desc = await askAI(`Explain the following dc-ts command "${m.name}" in business terms:\n\n${m.full}`)
    out.push(`### \`${m.name}\`\n${desc}\n`)
  }

  out.push('\n---\n## 🧪 Business Rules\n')
  failMatches.forEach(f => {
    out.push(`- \`${f}\` — *(description pending)*`)
  })

  out.push('\n---\n## 📋 Decision Tables\n')
  for (const entry of constraintsByWf) {
    if (!entry?.functions?.length) continue
    const allFns = entry.functions.map(fn => {
      const regex = new RegExp(`const\\s+${fn}\\s*=\\s*\\(.*?\\)\\s*=>\\s*\\(.*?\\)\\s*=>\\s*{([\\s\\S]*?)\\n\\}`, 'm')
      const match = constraintSrc.match(regex)
      return match ? `Constraint: ${fn}\n${match[1].trim()}` : ''
    }).join('\n\n')

    const table = await askAI(`You are a business analyst. Based on these constraint definitions, generate a decision table (in Markdown) and summarize the business logic.\n\n${allFns}`)
    out.push(`### 🔹 Workflow: \`${entry.wf}\`\n${table}\n`)
  }

  out.push('\n---\n## 🟧 Event Catalog\n')
  for (const m of messages.filter(m => m.kind === 'evt')) {
    const desc = await askAI(`Explain the following dc-ts event "${m.name}" in business terms:\n\n${m.full}`)
    out.push(`### \`${m.name}\`\n${desc}\n`)
  }

  out.push('\n---\n## 🔁 Event Flow\n```mermaid\ngraph TD\n')
  for (const cmd of cmdNames) {
    const match = evtNames.find(evt => evt.includes(cmd.replace('Cmd', '').split(/(?=[A-Z])/)[0]))
    if (match) out.push(`  ${cmd} --> ${match}\n`)
  }
  out.push('```\n')

  const summary = await askAI(`Summarize the domain logic of the "${aggregateName}" model as if explaining it to a product manager.`)
  out.push('\n---\n## 🧠 Summary\n')
  out.push(summary)

  const outPath = path.join(baseDir, '_implementation', `${aggregateName}.business.md`)
  fs.writeFileSync(outPath, out.join('\n'), 'utf-8')
  console.log(`✅ Business doc written to:\n${outPath}`)
}

run()
