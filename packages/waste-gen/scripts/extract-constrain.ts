import fs from 'fs'
import path from 'path'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import generate from '@babel/generator'

const filePath = process.argv[2]
if (!filePath) {
  console.error('❌ Please provide the path to constrain.ts')
  process.exit(1)
}

const src = fs.readFileSync(path.resolve(filePath), 'utf-8')
const ast = parse(src, {
  sourceType: 'module',
  plugins: ['typescript']
})

type ConstraintEntry = {
  cmd: string
  fn: string
  condition: string
  failureMsg: string
}

const cmdToFns = new Map<string, string[]>()
const fnBodies = new Map<string, t.BlockStatement>()
const entries: ConstraintEntry[] = []

// Step 1: gather all constraint functions: const _myConstraint = (cmd) => (state) => { ... }
traverse(ast, {
  VariableDeclarator(path) {
    const id = path.node.id
    const init = path.node.init
    if (
      t.isIdentifier(id) &&
      id.name.startsWith('_') &&
      t.isArrowFunctionExpression(init) &&
      t.isArrowFunctionExpression(init.body)
    ) {
      if (t.isBlockStatement(init.body.body)) {
        fnBodies.set(id.name, init.body.body)
      }
    }
  }
})

// Step 2: find applyConstrains([...])(cmd)(state) inside each switch case
traverse(ast, {
  SwitchCase(path) {
    const test = path.node.test
    if (t.isStringLiteral(test)) {
      const cmd = test.value
      const fns: string[] = []

      path.traverse({
        CallExpression(callPath) {
          const callee = callPath.node.callee
          const args = callPath.node.arguments

          // Look for applyConstrains([_a, _b])
          if (
            t.isCallExpression(callPath.node) &&
            t.isIdentifier(callee, { name: 'applyConstrains' }) &&
            args.length > 0 &&
            t.isArrayExpression(args[0])
          ) {
            const arr = args[0]
            arr.elements.forEach((el) => {
              if (t.isIdentifier(el)) {
                fns.push(el.name)
              }
            })
          }
        }
      })

      cmdToFns.set(cmd, fns)
    }
  }
})

// Step 3: walk constraint functions and extract fail conditions
for (const [cmd, fns] of cmdToFns.entries()) {
  fns.forEach((fn) => {
    const body = fnBodies.get(fn)
    if (!body) return

    for (const stmt of body.body) {
      if (
        t.isIfStatement(stmt) &&
        t.isBlockStatement(stmt.consequent) &&
        stmt.consequent.body.length
      ) {
        const failStmt = stmt.consequent.body.find(
          (b) =>
            t.isReturnStatement(b) &&
            t.isCallExpression(b.argument) &&
            t.isIdentifier(b.argument.callee, { name: 'fail' })
        ) as t.ReturnStatement | undefined

        if (failStmt) {
          const failArgs = (failStmt.argument as t.CallExpression).arguments
          const msg = failArgs[0]
          if (t.isStringLiteral(msg)) {
            entries.push({
              cmd,
              fn,
              condition: generate(stmt.test).code,
              failureMsg: msg.value
            })
          }
        }
      }
    }
  })
}

// Step 4: Output markdown + json
const markdown = `# Constraint Decision Table

| Command Type       | Constraint Function     | Condition                                | Failure Message                 |
|--------------------|-------------------------|-------------------------------------------|----------------------------------|
${entries
  .map(
    (e) =>
      `| ${e.cmd.padEnd(18)} | ${e.fn.padEnd(23)} | ${e.condition.padEnd(41)} | ${e.failureMsg} |`
  )
  .join('\n')}
`

const outputDir = path.dirname(filePath)
fs.writeFileSync(path.join(outputDir, 'constraints.md'), markdown)
fs.writeFileSync(
  path.join(outputDir, 'constraints.json'),
  JSON.stringify(entries, null, 2)
)

console.log(`✅ Extracted ${entries.length} constraints`)
console.log(`📄 Saved to constraints.md`)
console.log(`📦 Saved to constraints.json`)
