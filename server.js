import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';

const PORT = process.env.PORT;
const APIKEY = process.env.API_KEY;

const app = express();

app.use(express.json());
app.use(cors());


app.post('/completions', async(req, res) => {

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${APIKEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.message}],
            max_tokens: 100,
        })
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.send(data);
    }
    catch(err){
        console.log("Error:", err);
    }

});

app.listen(PORT, () => console.log('Mein Port ist: ' + PORT));