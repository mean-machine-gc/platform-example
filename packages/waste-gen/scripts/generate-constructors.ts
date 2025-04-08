import * as path from 'path'
import * as fs from 'fs'

const DOMAIN_PATH = path.resolve(__dirname, '../domain')
const SCHEMA_PATH = path.resolve(DOMAIN_PATH, '../domain/_schema')
const OUTPUT_PATH = path.resolve(DOMAIN_PATH, 'constructors.ts')

const workflowName = process.argv[2]

if (!workflowName) {
  console.error('❌ Please provide a workflow name, e.g.:')
  console.error('   npx tsx scripts/generate-constructors.ts treatment')
  process.exit(1)
}

const inputModelPath = path.resolve(DOMAIN_PATH, `${workflowName}.ts`)
const schemaImportPath = `../domain/_schema/${workflowName}.schema`

if (!fs.existsSync(inputModelPath)) {
  console.error(`❌ Domain model not found: ${inputModelPath}`)
  process.exit(1)
}

const schemaFilePath = path.resolve(SCHEMA_PATH, `${workflowName}.schema.ts`)
if (!fs.existsSync(schemaFilePath)) {
  console.error(`❌ Schema file not found: ${schemaFilePath}`)
  process.exit(1)
}

const baseName = workflowName.charAt(0).toUpperCase() + workflowName.slice(1)

const output = `// Auto-generated constructors for ${workflowName} workflow\n\n` +
  `import { newCmd, newEvt, newAgg, safeParseTBox } from 'dc-ts'\n` +
  `import * as ${baseName}Schema from '${schemaImportPath}'\n\n` +
  `export const new${baseName}CMD = newCmd<any, any>(safeParseTBox(${baseName}Schema.${baseName}Cmd))\n` +
  `export const new${baseName}EVT = newEvt<any, any>(safeParseTBox(${baseName}Schema.${baseName}Evt))\n` +
  `export const new${baseName}Agg = newAgg<any>(safeParseTBox(${baseName}Schema.${baseName}Aggregate))\n`

fs.writeFileSync(OUTPUT_PATH, output)
console.log(`✅ Constructors written for '${workflowName}' → ${OUTPUT_PATH}`)