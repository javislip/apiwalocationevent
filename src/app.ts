import { createBot, MemoryDB, createProvider, addKeyword, createFlow } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'

const flowEmpty = addKeyword ('').addAnswer('')

const PORT = 3001

const main = async () => {
    const provider = createProvider(BaileysProvider)

    const { handleCtx, httpServer } = await createBot({
        database: new MemoryDB(),
        provider: provider,
        flow: createFlow([flowEmpty]),
    })

    httpServer(+PORT)

    provider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
        const { number, message } = req.body
        await bot.sendMessage(number, message, {})
        return res.end('send')
    }))
}

main()