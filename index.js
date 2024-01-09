const cors = require("cors");
const express = require("express");
const axios = require("axios");
const path = require("path");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Attendance/index.html"));
});

//? we don't need that anymore.
app.post("/studentNumber", async (req, res) => {
  const { ogrenciNo } = req.body;
  const data = `name=ogrenciBilgiGetir&ogrenciNo=${ogrenciNo}`;
  const config = {
    method: "post",
    url: "https://pdks.nisantasi.edu.tr/ogrenci/giris-islem",
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Pragma: "no-cache",
      "Sec-Ch-Ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "X-Requested-With": "XMLHttpRequest",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while making the request.");
  }
});

app.post("/lectureInfo", async (req, res) => {
  const { name, yoklamaKodu } = req.body;
  const data = `name=${name}&yoklamaKodu=${yoklamaKodu}`;
  const config = {
    method: "post",
    url: "https://pdks.nisantasi.edu.tr/ogrenci/giris-islem",
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Pragma: "no-cache",
      "Sec-Ch-Ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "X-Requested-With": "XMLHttpRequest",
    },
    data: data,
  };
  try {
    const response = await axios(config);
    const $ = cheerio.load(response.data.icerik);

    const options = [];
    $("option").each(function (i, elem) {
      const option = $(this);
      options[i] = {
        lessonName: option.text(),
        lessonId: option.val(),
        lessonCode: option.text().split("/")[0].trim(),
      };
    });
    res.json([
      {
        lessonName:
          "Mühendislik Mimarlık Fakültesi - Yazılım Mühendisliği (İngilizce) - ESOF319 - Artificial Intelligence",
        lessonId: "3635",
        lessonCode: " ESOF319 ",
      },
      {
        lessonName:
          "Mühendislik Mimarlık Fakültesi - Yazılım Mühendisliği (İngilizce) - ESOF315 - Database Management Systems",
        lessonId: "5846",
        lessonCode: " ESOF315 ",
      },
    ]);
    /* if (options.length === 0) {
      res.status(500).send("An error occurred while making the request.");
    } else {
      res.json(options);
    } */
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while making the request.");
  }
});

app.post("/joinLecture", async (req, res) => {
  const { ogrenciNo, yoklamaKodu, getKod, yoklamaDers } = req.body;
  const name = "derseKatil";
  const data = `------WebKitFormBoundary7NrnXUIBOJHGGJWo\r\nContent-Disposition: form-data; name="ogrenciNo"\r\n\r\n${ogrenciNo}\r\n------WebKitFormBoundary7NrnXUIBOJHGGJWo\r\nContent-Disposition: form-data; name="yoklamaKodu"\r\n\r\n${yoklamaKodu}\r\n------WebKitFormBoundary7NrnXUIBOJHGGJWo\r\nContent-Disposition: form-data; name="yoklamaDers"\r\n\r\n${yoklamaDers}\r\n------WebKitFormBoundary7NrnXUIBOJHGGJWo\r\nContent-Disposition: form-data; name="name"\r\n\r\n${name}\r\n------WebKitFormBoundary7NrnXUIBOJHGGJWo\r\nContent-Disposition: form-data; name="getKod"\r\n\r\n${getKod}\r\n------WebKitFormBoundary7NrnXUIBOJHGGJWo--\r\n`;

  const config = {
    method: "post",
    url: "https://pdks.nisantasi.edu.tr/ogrenci/giris-islem",
    headers: {
      authority: "pdks.nisantasi.edu.tr",
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
      "cache-control": "no-cache",
      "content-type":
        "multipart/form-data; boundary=----WebKitFormBoundary7NrnXUIBOJHGGJWo",
      cookie:
        "cf_clearance=kS9lOXcoiXslIfDGBhk0p3apVZKRBX15eF5h3ERpXv8-1702900384-0-1-192d3871.3c15a399.89c61554-0.2.1702900384",
      dnt: "1",
      origin: "https://pdks.nisantasi.edu.tr",
      pragma: "no-cache",
      referer: "https://pdks.nisantasi.edu.tr/ogrenci/giris/" + getKod,
      "sec-ch-ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "x-requested-with": "XMLHttpRequest",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    const $ = cheerio.load(response.data.mesaj);
    const header = $(".modal-header h5").text();
    const paragraph = $(".modal-body p").text();
    res.json({ header, paragraph });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while making the request.");
  }
});

app.post("/QR", async (req, res) => {
  const url = req.body.url;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const options = [];
    $("option").each(function (i, elem) {
      const option = $(this);
      if (option.val().length === 0) {
        return;
      }
      options[i] = {
        lessonName: option.text(),
        lessonId: option.val(),
        lessonCode: option.text().split("/")[0].trim(),
      };
    });
    if (options.length === 0) {
      res.status(500).send("An error occurred while making the request.");
    } else {
      res.json(options);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while making the request.");
  }
});
app.post("/getStudentLessons", async (req, res) => {
  const studentNo = req.body.studentNo.trim();

  const config = {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Opera";v="106"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrer: "https://pdks.nisantasi.edu.tr/ogrenci/devam-devamsizlik",
    referrerPolicy: "strict-origin-when-cross-origin",
    method: "POST",
    mode: "cors",
    credentials: "include",
    url: "https://pdks.nisantasi.edu.tr/ogrenci/devam-devamsizlik-islem",
    data: `name=ogrenciBilgiGetir&ogrenciNo=${studentNo}`,
  };
  try {
    const response = await axios(config);
    const $ = cheerio.load(response.data.icerik);

    const options = [];
    $("option").each(function (i, elem) {
      const option = $(this);
      options[i] = {
        lessonName: option.text(),
        lessonId: option.val(),
        lessonCode: option.text().split("-")[2],
      };
    });
    options.map((option, index) => {
      if (option.lessonId == "") {
        options.splice(index, 1);
      }
    });
    if (options.length === 0) {
      res.status(500).send("Not enough lessons");
    } else {
      res.json(options);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while making the request.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
