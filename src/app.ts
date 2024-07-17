import { createBot, MemoryDB, createProvider, addKeyword, createFlow } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
import { EVENTS } from "@builderbot/bot"

    const flowLocation = addKeyword(EVENTS.LOCATION)
      .addAnswer('Ubicacion Recibida', null, async (ctx, {flowDynamic}) => {
          const latitud = ctx.message.locationMessage.degreesLatitude
          const longitud = ctx.message.locationMessage.degreesLongitude
          await flowDynamic(`https://maps.google.com/?q=${latitud},${longitud}`)
        })

const PORT = 3002

const main = async () => {
    const provider = createProvider(BaileysProvider)

    const { handleCtx, httpServer } = await createBot({
        database: new MemoryDB(),
        provider: provider,
        flow: createFlow([flowLocation]),

    })

    httpServer(+PORT)
    

    provider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
        try {
          const { number, message } = req.body
          await bot.sendMessage(number, message, {})
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ respuesta: "enviado" }))
        } catch (error) {
          console.error('Error sending message:', error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Internal Server Error' }))
        }
    // provider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
    //     const { number, message } = req.body
    //     await bot.sendMessage(number, message, {})
    //     return res.json({ respuesta: "ok 200" })    
    }))
}

main()