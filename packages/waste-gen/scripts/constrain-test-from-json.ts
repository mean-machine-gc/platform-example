// scripts/generate-constraint-tests.ts

import fs from 'fs'
import path from 'path'

const constraintFile = process.argv[2]

if (!constraintFile) {
  console.error('❌ Please provide the path to constraints.json')
  console.error('Example: npx tsx scripts/generate-constraint-tests.ts Core/treatment/_implementation/constraints.json')
  process.exit(1)
}

const constraints: {
  cmd: string
  fn: string
  condition: string
  failureMsg: string
}[] = JSON.parse(fs.readFileSync(path.resolve(constraintFile), 'utf-8'))

const baseDir = path.dirname(path.resolve(constraintFile))
const testDir = path.join(baseDir, 'tests', 'constraints')
fs.mkdirSync(testDir, { recursive: true })

const groupByCmd: Record<string, typeof constraints> = {}

for (const entry of constraints) {
  if (!groupByCmd[entry.cmd]) groupByCmd[entry.cmd] = []
  groupByCmd[entry.cmd].push(entry)
}

for (const [cmd, list] of Object.entries(groupByCmd)) {
  const file = path.join(testDir, `${cmd}.test.ts`)
  const lines: string[] = []

  lines.push(`import { constrainTreatment } from '../constrain'`)
  lines.push(`import { sampleCmd, sampleState } from '../testkit'`)
  lines.push(`import { isFailure } from 'dc-ts'`)
  lines.push(``)
  lines.push(`describe('${cmd}', () => {`)

  for (const constraint of list) {
    const testName = constraint.failureMsg.replace(/_/g, ' ')
    const cmdVar = 'cmd'
    const stateVar = 'state'

    lines.push(`  it('fails if ${testName}', () => {`)
    lines.push(`    const ${cmdVar} = sampleCmd('${cmd}', {`)
    lines.push(`      // TODO: override this with data that triggers:`)
    lines.push(`      // ${constraint.condition}`)
    lines.push(`    })`)
    lines.push(`    const ${stateVar} = sampleState('initial')`)
    lines.push(``)
    lines.push(`    const result = constrainTreatment(${cmdVar})(${stateVar})`)
    lines.push(`    expect(isFailure(result)).toBe(true)`)
    lines.push(`    expect(result.cause.some(c => c.msg === '${constraint.failureMsg}')).toBe(true)`)
    lines.push(`  })`)
    lines.push(``)
  }

  lines.push(`})`)

  fs.writeFileSync(file, lines.join('\n'), 'utf-8')
  console.log(`✅ Generated: ${file}`)
}
