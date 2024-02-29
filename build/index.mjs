import { log } from "console";
import { shell } from "./exec.mjs";
import { readFile, writeFile } from "fs/promises";

const version = '1.0.10'


    ; (async () => {
        const jsonStr = await readFile('build/package.json', { encoding: 'utf-8' })

        const json = JSON.parse(jsonStr)
        json.version = version

        const md = await readFile('README.md', { encoding: 'utf-8' })

        const mdRes = md.toString().replace(/npm-([\d\-.\w]+)-skyblue/mg, (m, m1) => {
            const ov = m1.replace('--', '-')
            if (ov != version)
                console.log(`\told version: ${ov}\n\tnew version: ${version}`)

            return `npm-${version.replace('-', '--')}-skyblue`
        })

        await Promise.allSettled([
            writeFile('dist/README.md', mdRes),
            writeFile('build/package.json', JSON.stringify(json, undefined, 2)),
            writeFile('dist/package.json', JSON.stringify(json, undefined, 2))
        ]).then(() => {
            console.log('write finish!')
        }).catch((e) => {
            log(`write err: ${e}`)
        })

        await shell('cp src/index.d.ts dist/')
        // await shell('rm -fr ../../packages/vuepress-plugin-demo-code-block')
        shell('mv -f dist ../../packages/vuepress-plugin-demo-code-block')
        shell('echo ok')
    })();
