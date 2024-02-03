import fastify from 'fastify';
import view from '@fastify/view';
import handlebars from 'handlebars';
import {getData, getHash} from "./api.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import process from "process";

const server = fastify();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


server.register(view, {
    engine: {
        handlebars,
    },
    includeViewExtension: true,
    templates: resolve(__dirname, '../'),
    options: {
        partials: {
            header: '/templates/header.hbs',
            footer: '/templates/footer.hbs',
            character: '/templates/character.hbs'
        },
    },
});


const publicKey = "0d85e1ac605d6f7414b5b292aaff30cb";
const privateKey = "3ffeec7fcfa46be6a394358cfa80faf11982d02d";
const ts = Date.now();

const hash = await getHash(publicKey, privateKey, ts);
const url = "https://gateway.marvel.com:443/v1/public/characters?ts="+ts.toString()+"&apikey="+publicKey+"&hash="+hash.toString();

let data = await getData(url);

let personnages = [];

for(let i = 0; i<data.data.results.length; ++i) {
    if (!data.data.results[i].thumbnail.path.toString().includes("image_not_available")) {
        personnages[i] = data.data.results[i];
    }
}

server.get('/', (request, reply) => {
    reply.view('/templates/index.hbs', { characters: personnages });
});
server.listen({ port: 3000, host: '127.0.0.1' })
    .then((address) => console.log(`Server listening at ${address}`))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });