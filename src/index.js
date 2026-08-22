import {app} from './app.js'
import { mongoDbConnection } from './db/db.js'
mongoDbConnection()
app.listen(process.env.PORT,()=>{
    console.log(`App is listening on ${process.env.PORT}`)
})