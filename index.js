const cors = require('cors');
const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/studentNumber', async (req, res) => {
    const { name, ogrenciNo } = req.body;
    const data = `name=${name}&ogrenciNo=${ogrenciNo}`;
    const config = {
        method: 'post',
        url: 'https://pdks.nisantasi.edu.tr/ogrenci/giris-islem',
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Pragma': 'no-cache',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        },
        data: data
    };

    try {
        const response = await axios(config);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while making the request.');
    }
});

app.post('/lectureInfo', async (req, res) => {
    const { name, yoklamaKodu } = req.body;
    const data = `name=${name}&yoklamaKodu=${yoklamaKodu}`;
    const config = {
        method: 'post',
        url: 'https://pdks.nisantasi.edu.tr/ogrenci/giris-islem',
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Pragma': 'no-cache',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        },
        data: data
    };
    try {
        const response = await axios(config);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while making the request.');
    }
});

app.post('/joinLecture', async (req, res) => {
    const { ogrenciNo, yoklamaKodu, getKod, yoklamaDers } = req.body;
    const name = 'derseKatil';
    const data = `------WebKitFormBoundary7NrnXUIBOJHGGJWo\r\nContent-Disposition: form-data; name="ogrenciNo"\r\n\r\n${ogrenciNo}\r\n------WebKitFormBoundary7NrnXUIBOJHGGJWo\r\nContent-Disposition: form-data; name="yoklamaKodu"\r\n\r\n${yoklamaKodu}\r\n------WebKitFormBoundary7NrnXUIBOJHGGJWo\r\nContent-Disposition: form-data; name="yoklamaDers"\r\n\r\n${yoklamaDers}\r\n------WebKitFormBoundary7NrnXUIBOJHGGJWo\r\nContent-Disposition: form-data; name="name"\r\n\r\n${name}\r\n------WebKitFormBoundary7NrnXUIBOJHGGJWo\r\nContent-Disposition: form-data; name="getKod"\r\n\r\n${getKod}\r\n------WebKitFormBoundary7NrnXUIBOJHGGJWo--\r\n`;

    const config = {
        method: 'post',
        url: 'https://pdks.nisantasi.edu.tr/ogrenci/giris-islem',
        headers: {
            'authority': 'pdks.nisantasi.edu.tr',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7',
            'cache-control': 'no-cache',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7NrnXUIBOJHGGJWo',
            'cookie': 'cf_clearance=kS9lOXcoiXslIfDGBhk0p3apVZKRBX15eF5h3ERpXv8-1702900384-0-1-192d3871.3c15a399.89c61554-0.2.1702900384',
            'dnt': '1',
            'origin': 'https://pdks.nisantasi.edu.tr',
            'pragma': 'no-cache',
            'referer': 'https://pdks.nisantasi.edu.tr/ogrenci/giris/' + getKod,
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
        },
        data: data
    };

    try {
        const response = await axios(config);
        const $ = cheerio.load(response.data.mesaj);
        const header = $('.modal-header h5').text();
        const paragraph = $('.modal-body p').text();
        res.json({ header, paragraph });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while making the request.');
    }
});

app.post('/QR', async (req, res) => {
    const url = req.body.url;
    if (!url.startsWith('https://pdks.nisantasi.edu.tr/ogrenci/giris')) {
        res.status(400).send('Invalid URL');
        return;
    }
    else {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const selectedElement = $('select[name="yoklamaDers"]').html();
            res.send(selectedElement);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while making the request.');
        }
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
