const dd = (val) => console.log(val)
const p = require('path')
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const cors = require('kcors')
const config = require('config')
const url = require('url')
const app = new Koa()
const router = require('koa-router')()

/* MIDDLEWARE */
app.use(bodyparser())
app.use(cors())

const libi = require('libi')({
    homedir: p.resolve(config.directory.home),
    agent: require('meta-agent')(config.api)
})

router.get('/movies', async (ctx) => {
    const lib = libi('movies')
    ctx.body = lib
})

router.get('/movies-import', async (ctx) => {
    const lib = libi('movies')
    ctx.body = await lib.import()
})

router.get('/movies-graph', async (ctx) => {
    const lib = libi('movies')
    ctx.body = await lib.graph()
})

router.get('/movies-graphup', async (ctx) => {
    const lib = libi('movies')
    ctx.body = await lib.updateGraph()
})


router.get('/shows', async (ctx) => {
    const lib = libi('shows')
    ctx.body = lib
})

router.get('/shows-import', async (ctx) => {
    const lib = libi('shows')
    ctx.body = await lib.import()
})

router.get('/shows-graph', async (ctx) => {
    const lib = libi('shows')
    ctx.body = await lib.graph()
})

router.get('/shows-graphup', async (ctx) => {
    const lib = libi('shows')
    ctx.body = await lib.updateGraph()
})


/* ROUTES */
app.use(router.routes())

app.listen(config.server.port, () => {
    console.log(`running at ${url.format(config.server)}`)
})