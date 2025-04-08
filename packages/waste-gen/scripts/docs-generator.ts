// scripts/generate-doc.ts

import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'

const aggregateName = process.argv[2]

if (!aggregateName) {
  console.error('❌ Please provide an aggregate name:')
  console.error('   npx tsx scripts/generate-doc.ts treatment')
  process.exit(1)
}

const domainPath = path.resolve(`../waste-gen/Core/${aggregateName}/domain.ts`)
if (!fs.existsSync(domainPath)) {
  console.error(`❌ Domain model not found at: ${domainPath}`)
  process.exit(1)
}

const source = fs.readFileSync(domainPath, 'utf-8')
const sourceFile = ts.createSourceFile(domainPath, source, ts.ScriptTarget.Latest, true)

const workflows: {
  name: string
  cmdType: string
  evtType: string
  outputTag: string
  failures: string[]
}[] = []

sourceFile.forEachChild((node) => {
  if (
    ts.isTypeAliasDeclaration(node) &&
    node.type &&
    ts.isTypeReferenceNode(node.type) &&
    node.type.typeName.getText() === 'CoreWf'
  ) {
    const [cmd, , evt, outAgg, fails] = node.type.typeArguments ?? []
    const name = node.name.text.replace(/Wf$/, '').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
    const cmdType = cmd?.getFullText().trim().replace(/[\n\r]+/g, ' ')
    const evtType = evt?.getFullText().trim().replace(/[\n\r]+/g, ' ')
    const outputTag = outAgg?.getFullText().match(/_tag:\s*'(.+?)'/)?.[1] ?? 'unknown'
    const failures = fails?.getText()
      .replace(/CoreWfFails\s*\|?/, '')
      .split('|')
      .map((f) => f.trim().replace(/^'|'$/g, ''))
      .filter(Boolean) ?? []

    workflows.push({ name, cmdType, evtType, outputTag, failures })
  }
})

let doc = `# 📘 ${aggregateName.charAt(0).toUpperCase() + aggregateName.slice(1)} Workflow Documentation\n\n`

for (const wf of workflows) {
  doc += `## ⚙️ Workflow: ${wf.name.replace(/-/g, ' ')}\n\n`
  doc += `### 🔹 Command\n\`\`\`ts\n${wf.cmdType}\n\`\`\`\n`
  doc += `### ✅ Event\n\`\`\`ts\n${wf.evtType}\n\`\`\`\n`
  doc += `### 🧱 New Aggregate Tag: \`${wf.outputTag}\`\`\n\n`

  if (wf.failures.length > 0) {
    doc += `### 🔒 Business Rule Failures\n`
    for (const f of wf.failures) {
      doc += `- \`${f}\`\n`
    }
    doc += '\n'
  }

  doc += `---\n\n`
}

const outPath = path.resolve(`Core/${aggregateName}/_implementation/${aggregateName}.doc.md`)
fs.writeFileSync(outPath, doc, 'utf-8')
console.log(`✅ Generated: ${outPath}`)
