import { readdirSync, writeFileSync } from 'fs'
const dirs = readdirSync('./desc').filter((e)=>e.endsWith('.js'))
writeFileSync('./list.json',JSON.stringify(dirs))
console.log(`Done! Added ${dirs.length} files to the list.`)

