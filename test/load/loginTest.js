import * as dotenv from "dotenv"
dotenv.config();

// Abuse login route
console.log("NGINX_URL: ", process.env.NGINX_URL);
let NGINX_URL = process.env.NGINX_URL;

async function abuseLogin () {
    for (let i = 0; i < 50; i++) {
        const response = await fetch(`${NGINX_URL}/log/user`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                username: "Blaice Chan",
                password: "HashMePlease"
            })
        })
        console.log(`Response ${i}: `, await response.json());
    }
}

await abuseLogin();