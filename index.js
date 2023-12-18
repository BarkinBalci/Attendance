const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');

const app = express();

app.use(bodyParser.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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
    const {ogrenciNo, yoklamaKodu, getKod} = req.body;
    const name = 'derseKatil';

    const data = `------WebKitFormBoundarySa7hpD9z1SWcqKSg\r\nContent-Disposition: form-data; name="ogrenciNo"\r\n\r\n${ogrenciNo}\r\n------WebKitFormBoundarySa7hpD9z1SWcqKSg\r\nContent-Disposition: form-data; name="yoklamaKodu"\r\n\r\n${yoklamaKodu}\r\n------WebKitFormBoundarySa7hpD9z1SWcqKSg\r\nContent-Disposition: form-data; name="name"\r\n\r\n${name}\r\n------WebKitFormBoundarySa7hpD9z1SWcqKSg\r\nContent-Disposition: form-data; name="getKod"\r\n\r\n${getKod}\r\n------WebKitFormBoundarySa7hpD9z1SWcqKSg--\r\n`;
    const config = {
        method: 'post',
        url: 'https://pdks.nisantasi.edu.tr/ogrenci/giris-islem',
        headers: {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7',
            'cache-control': 'no-cache',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundarySa7hpD9z1SWcqKSg',
            'pragma': 'no-cache',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
            'cookie': 'cf_clearance=dA5DJWjd6U5trFpQT87RRiB2N494.10iUQZAXqPiTqg-1702889088-0-1-192d3871.3c15a399.89c61554-0.2.1702889088',
            'Referer': 'https://pdks.nisantasi.edu.tr/ogrenci/giris',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
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
    

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});