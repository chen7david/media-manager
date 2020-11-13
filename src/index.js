const dd = (val) => console.log(val)
const p = require('path')
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const cors = require('kcors')
const config = require('config')
const url = require('url')
const app = new Koa()
const { cargo } = require('koatools')
const router = require('koa-router')()

/* MIDDLEWARE */
app.use(bodyparser())
app.use(cors())
app.use(cargo())

const libi = require('libi')({
    homedir: p.resolve(config.directory.home),
    agent: require('meta-agent')(config.api)
})

router.get('/movies', async (ctx) => {
    const lib = libi('movies')
    const graph = await lib.graph()
    if(graph) graph.forEach(s => delete s['videos'] && delete s['subtitles'])
    ctx.body = ctx.cargo.setPayload(graph || [])
})

router.get('/movies/:id', async (ctx) => {
    const { id } = ctx.params
    const lib = libi('movies')
    const graph = await lib.graph()
    ctx.body = ctx.cargo.setPayload(graph.find(m => m.id == id) || null)
})

router.get('/movies-import', async (ctx) => {
    const lib = libi('movies')
    await lib.import()
    ctx.body = ctx.cargo.setDetail('custom', 'movie-import complete!', 'success')
})

router.get('/movies-graph', async (ctx) => {
    const lib = libi('movies')
    await lib.updateGraph()
    ctx.body = ctx.cargo.setDetail('updated', 'movies-graph', 'success')
})

router.get('/shows', async (ctx) => {
    const lib = libi('shows')
    const graph = await lib.graph()
    graph.forEach(s => delete s['seasons'])
    ctx.body = ctx.cargo.setPayload(graph || [])
})

router.get('/shows/:id', async (ctx) => {
    const { id } = ctx.params
    const lib = libi('shows')
    const graph = await lib.graph()
    ctx.body = ctx.cargo.setPayload(graph.find(s => s.id == id) || null)
})

router.get('/shows-import', async (ctx) => {
    const lib = libi('shows')
    await lib.import()
    ctx.body = ctx.cargo.setDetail('custom', 'shows-import complete!', 'success')
})

router.get('/shows-graph', async (ctx) => {
    const lib = libi('shows')
    await lib.updateGraph()
    ctx.body = ctx.cargo.setDetail('updated', 'shows-graph', 'success')
})

/* ROUTES */
app.use(router.routes())

app.listen(config.server.port, () => {
    console.log(`running at ${url.format(config.server)}`)
})