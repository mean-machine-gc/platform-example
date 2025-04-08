// scripts/generate-asyncapi.ts

import 'esbuild-register/dist/node' // 👈 Register TypeScript support
import * as path from 'path'
import * as fs from 'fs'
import * as YAML from 'yaml'

const aggregate = process.argv[2]
if (!aggregate) {
  console.error('❌ Usage: npx tsx scripts/generate-asyncapi.ts treatment')
  process.exit(1)
}

const schemaPath = path.resolve(`../waste-gen/Core/${aggregate}/_implementation/_schema.ts`)
const outputPath = path.resolve(`../waste-gen/Core/${aggregate}/_implementation/asyncapi.yaml`)


if (!fs.existsSync(schemaPath)) {
    console.error(`❌ File not found: ${schemaPath}`)
    process.exit(1)
  }
  
  const schemaModule = require(schemaPath)
  const cmdSchema = schemaModule.TreatmentCmd
  const evtSchema = schemaModule.TreatmentEvt
  
  if (!cmdSchema || !evtSchema) {
    console.error('❌ Could not find TreatmentCmd or TreatmentEvt in schema')
    process.exit(1)
  }
  
  function toKebab(str: string) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  }
  function toPascal(str: string) {
    return str.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())
  }
  function extractVariants(schema: any): any[] {
    if (schema.anyOf) return schema.anyOf
    if (schema.oneOf) return schema.oneOf
    if (schema.type === 'object') return [schema]
    return []
  }
  function extractTypeLiteral(schema: any): string | undefined {
    if (schema?.properties?.type?.const) return schema.properties.type.const
    if (schema?.properties?.type?.enum?.[0]) return schema.properties.type.enum[0]
    return undefined
  }
  function isCommand(schema: any): boolean {
    const val = schema?.properties?.msgType
    return val?.const === 'cmd' || (Array.isArray(val?.enum) && val.enum.includes('cmd'))
  }
  
  const asyncapi: any = {
    asyncapi: '2.6.0',
    info: {
      title: `${aggregate} Domain API`,
      version: '1.0.0',
    },
    servers: {
      production: {
        url: 'mqtt://broker.example.com',
        protocol: 'mqtt',
        description: 'Production event broker',
      },
    },
    tags: [
      {
        name: aggregate,
        description: `Messages related to ${aggregate} workflows`,
      },
    ],
    channels: {},
    components: {
      messages: {},
      schemas: {},
    },
  }
  
  // Process all CMDs and EVTs together
  const allVariants = [...extractVariants(cmdSchema), ...extractVariants(evtSchema)]
  
  for (const variant of allVariants) {
    const type = extractTypeLiteral(variant)
    if (!type) continue
  
    const isCmd = isCommand(variant)
    const camel = `${isCmd ? 'Cmd' : 'Evt'}_${type}`
    const kebab = toKebab(type)
    const pascal = toPascal(kebab)
  
    asyncapi.channels[kebab] = {
      [isCmd ? 'publish' : 'subscribe']: {
        operationId: `${isCmd ? 'send' : 'receive'}${pascal}`,
        description: `Handles ${kebab} ${isCmd ? 'command' : 'event'}`,
        message: {
          $ref: `#/components/messages/${camel}`,
        },
      },
    }
  
    asyncapi.components.messages[camel] = {
        name: kebab,
        title: camel,
        payload: {
          oneOf: [
            { $ref: `#/components/schemas/${camel}` }
          ]
        }
      }
  
    asyncapi.components.schemas[camel] = variant
  }
  
  fs.writeFileSync(outputPath, YAML.stringify(asyncapi, { indent: 2 }))
  console.log(`✅ AsyncAPI spec written to: ${outputPath}`)