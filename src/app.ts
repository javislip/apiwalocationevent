import { createBot, MemoryDB, createProvider, addKeyword, createFlow } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
import { EVENTS } from "@builderbot/bot"

    const flowLocation = addKeyword(EVENTS.LOCATION)
      .addAnswer('Ubicacion Recibida', null, async (ctx, {flowDynamic}) => {
          const latitud = ctx.message.locationMessage.degreesLatitude
          const longitud = ctx.message.locationMessage.degreesLongitude
          await flowDynamic(`Latitud ${latitud}, Longitud ${longitud}`)
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
        const { number, message } = req.body
        await bot.sendMessage(number, message, {})
        return res.end('send')
    }))
}

main()