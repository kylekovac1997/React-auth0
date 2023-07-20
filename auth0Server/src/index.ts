import express, { ErrorRequestHandler } from "express";
import cors from "cors"
import jwks from "jwks-rsa";
import axios from "axios"
import { auth } from 'express-oauth2-jwt-bearer';
const app = express();
app.use(cors())
const port = 4000;

const verifyJwt = auth({
    audience: 'this is a unique identifier',
    issuerBaseURL: 'https://dev-epm452zh4vwovkb3.us.auth0.com/',
    tokenSigningAlg: 'RS256'
  });

// // enforce on all endpoints
// app.use(verifyJwt)

// define a route handler for the default home page
app.get( "/", ( req: express.Request, res: express.Response ) => {
    res.send( "Hello world!" );
} );



app.get( "/protected", verifyJwt, ( req: express.Request, res: express.Response ) => {
    res.send( "Hello world! from protected routes" );
} );


app.use((error: { status: number; message: string; },req: express.Request,res: express.Response,next: express.NextFunction)=>{
    const status = error.status || 500;
    const message = error.message ||  "internal server error";
    res.status(status).send(message);
})


// app.get( "/", ( req: express.Request, res: express.Response ) => {
//     res.send( "Hello worldss!" );
// } );




// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );