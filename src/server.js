import {getData, getHash} from "./api.js";

const publicKey = "0d85e1ac605d6f7414b5b292aaff30cb"
const privateKey = "3ffeec7fcfa46be6a394358cfa80faf11982d02d"
const ts = Date.now()

const hash = await getHash(publicKey, privateKey, ts)
const url = "http://gateway.marvel.com/v1/public/comics?ts="+ts.toString()+"&apikey="+publicKey+"&hash="+hash.toString();


let data = await getData(url)

console.log(data)

let finalData;

for(let i = 0; i<data.length; ++i) {
    if (data.get("data").get("results").get(i).get("thumbnail")!=null) {
        finalData.add(data.get("data").get("results").get(i))
    }
}

console.log(finalData)