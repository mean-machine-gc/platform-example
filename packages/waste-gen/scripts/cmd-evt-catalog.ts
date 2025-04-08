import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
import * as dotenv from 'dotenv'
import { OpenAI } from 'openai'

dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const wfName = process.argv[2]
if (!wfName) {
  console.error('❌ Please provide a workflow name:')
  console.error('   npx tsx scripts/generate-catalog.ts treatment')
  process.exit(1)
}

const domainPath = path.resolve(`Core/${wfName}/domain.ts`)
if (!fs.existsSync(domainPath)) {
  console.error(`❌ Domain file not found: ${domainPath}`)
  process.exit(1)
}

const source = fs.readFileSync(domainPath, 'utf-8')
const sourceFile = ts.createSourceFile(domainPath, source, ts.ScriptTarget.Latest, true)

type Message = { kind: 'cmd' | 'evt'; name: string; full: string }

const messages: Message[] = []

function extractMessages(node: ts.Node) {
  if (
    ts.isTypeAliasDeclaration(node) &&
    node.type &&
    ts.isTypeReferenceNode(node.type) &&
    ['CMD', 'EVT'].includes(node.type.typeName.getText())
  ) {
    const kind = node.type.typeName.getText() === 'CMD' ? 'cmd' : 'evt'
    const name = node.name.getText()
    messages.push({ kind, name, full: node.getText() })
  }
  ts.forEachChild(node, extractMessages)
}
extractMessages(sourceFile)

async function describe(type: string, kind: 'cmd' | 'evt', definition: string) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0.4,
    messages: [
      {
        role: 'user',
        content: `You are helping generate business-readable descriptions for a system using dc-ts. The following is a ${kind.toUpperCase()} named "${type}". Describe what it represents in 1-2 lines. Be clear, concise, and domain-aware.\n\n${definition}`,
      },
    ],
  })
  return res.choices[0].message.content || ''
}

async function run() {
  console.log(`🧠 Generating descriptions for ${messages.length} messages...`)
  const descriptions: Record<string, string> = {}

  for (const msg of messages) {
    const desc = await describe(msg.name, msg.kind, msg.full)
    descriptions[msg.name] = desc
  }

  const outFile = path.resolve(`Core/${wfName}/_implementation/${wfName}.catalog.md`)
  let output = `# 📋 Command & Event Catalog — ${wfName.charAt(0).toUpperCase() + wfName.slice(1)}\n\n`

  const cmds = messages.filter((m) => m.kind === 'cmd')
  const evts = messages.filter((m) => m.kind === 'evt')

  if (cmds.length) {
    output += `## 🟦 Commands\n\n`
    for (const cmd of cmds) {
      output += `### \`${cmd.name}\`\n${descriptions[cmd.name]}\n\n`
    }
  }

  if (evts.length) {
    output += `---\n\n## 🟧 Events\n\n`
    for (const evt of evts) {
      output += `### \`${evt.name}\`\n${descriptions[evt.name]}\n\n`
    }
  }

  fs.writeFileSync(outFile, output)
  console.log(`✅ Catalog written to:\n${outFile}`)
}

run()
