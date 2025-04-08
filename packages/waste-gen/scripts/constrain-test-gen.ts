// scripts/generate-tests.ts

import * as fs from 'fs'
import * as path from 'path'

const aggregate = process.argv[2]
if (!aggregate) {
  console.error('❌ Please provide an aggregate name (e.g. treatment)')
  process.exit(1)
}

const constrainPath = path.resolve(`../waste-gen/Core/${aggregate}/_implementation/constrain.ts`)
const testPath = path.resolve(`../waste-gen/Core/${aggregate}/_implementation/tests/constrain-${aggregate}.test.ts`)
fs.mkdirSync(path.dirname(testPath), { recursive: true })

if (!fs.existsSync(constrainPath)) {
  console.error(`❌ Cannot find: ${constrainPath}`)
  process.exit(1)
}

const source = fs.readFileSync(constrainPath, 'utf-8')

// Find all constraint function names and associated failure messages
const fnBlocks = source.matchAll(/const (\_\w+) = \(cmd: ([^)]+)\) => \(state: ([^)]+)\) => \{([\s\S]*?)\n\}/g)

const constraintTests: string[] = []

for (const match of fnBlocks) {
  const [_, fnName, cmdType, stateType, body] = match
  const failures = [...body.matchAll(/fail\(['"`]([^'"`]+)['"`]/g)].map((f) => f[1])
  const hasSuccess = body.includes('return succeed(state)')

  const cmdLiteral = cmdType.match(/['"`](.*?)['"`]/)?.[1] ?? cmdType
  const description = fnName.replace(/^_/, '').replace(/([A-Z])/g, ' $1')

  constraintTests.push(`  describe('${description} (${cmdLiteral})', () => {`)

  if (hasSuccess) {
    constraintTests.push(`    it('✅ allows valid command', () => {
      const cmd = {} as any
      const state = {} as any
      const res = ${fnName}(cmd)(state)
      expect(res.outcome).toBe('success')
    })`)
  }

  for (const failure of failures) {
    constraintTests.push(`    it('❌ fails with ${failure}', () => {
      const cmd = {} as any
      const state = {} as any
      const res = ${fnName}(cmd)(state)
      expect(res.outcome).toBe('failure')
      expect(res.cause.some(c => c.msg === '${failure}')).toBe(true)
    })`)
  }

  constraintTests.push(`  })`)
}

const finalTest = `// Auto-generated test for constraints on ${aggregate}

import { ${constraintTests.length > 0 ? constraintTests.map((t) => t.match(/'(.+?)'/)?.[1]?.split(' ')[0] || '' ).join(', ') : ''} } from '../constrain'
import { succeed } from 'dc-ts'

describe('Constraint logic for ${aggregate}', () => {
${constraintTests.join('\n\n')}
})
`

fs.writeFileSync(testPath, finalTest.trim() + '\n')
console.log(`✅ Constraint test written to: ${testPath}`)
