// scripts/generate-schemas.ts

import * as Codegen from '@sinclair/typebox-codegen'
import * as path from 'path'
import * as fs from 'fs'
import glob from 'fast-glob'

const DOMAIN_PATH = path.resolve(__dirname, '../domain')
const OUTPUT_DIR = path.resolve(__dirname, '../domain/_schema')
const STARTER_PATH = path.resolve(__dirname, './tBoxCodeGenBase.ts')

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const files = glob.sync(`${DOMAIN_PATH}/*.ts`)
const starterCode = fs.readFileSync(STARTER_PATH, 'utf8')

console.log(`Generating schemas from domain files:`)

for (const file of files) {
  const inputPath = path.resolve(file)
  const fileName = path.basename(file, '.ts')
  const outputPath = path.join(OUTPUT_DIR, `${fileName}.schema.ts`)

  const userSource = fs.readFileSync(inputPath, 'utf8')
  const fullSource = `${starterCode}\n\n${userSource}`

  try {
    const model = Codegen.TypeScriptToTypeBox.Generate(fullSource)
    // const typeboxCode = Codegen.ModelToTypeScript.Generate(model)

    const content = `// Auto-generated TypeBox schema from ${fileName}.ts\n` + model

    fs.writeFileSync(outputPath, content)
    console.log(`✅ Schema written: ${outputPath}`)
  } catch (err) {
    console.error(`❌ Failed to generate schema for ${fileName}:`, err)
  }
}

console.log('\n✅ All schemas processed.')
