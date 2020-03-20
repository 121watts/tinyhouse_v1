require('dotenv').config()

import express, {Application} from 'express'
import {ApolloServer} from 'apollo-server-express'
import {connectDatabase} from './database'
import {typeDefs, resolvers} from './graphql'
import {Database} from './lib/types'

const {PORT} = process.env

const mount = async (app: Application): Promise<void> => {
    const db = await connectDatabase()
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: (): {db: Database} => ({db}),
    })

    server.applyMiddleware({app, path: '/api'})

    app.listen(PORT)

    console.log(`[app] : http://localhost:${PORT}`)

    // ---
    const listings = await db.listings.find().toArray()

    console.log(listings)
}

mount(express())
