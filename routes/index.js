const router = require("express").Router();
const axios = require('axios');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/depo", (req, res, next) => {
  res.render("pages/depo.hbs");
  });

const key = 'GXNI0400YMK2FWZM';
const functionName = 'TIME_SERIES_DAILY';

  router.get("/stock-search", (req, res, next) => {

const symbolName = req.query.stocks;
console.log(`userinput ${symbolName}`)

const apiUrl = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbolName}&apikey=${key}`;
    axios
    .get(apiUrl)
    .then(response => {
      const axiosOutputData = response.data

      // let obj = JSON.parse(axiosOutputData)
      // console.log(obj)
    
    const stockData = axiosOutputData ['Time Series (Daily)']['2022-02-04']
      //console.log('Response from API is: ', stockData);

      res.render("pages/depo.hbs", { stockData, symbolName })

    })
    .catch(err => {
      console.log(err);
     err.response.status === 404 ? alert(`The stock ${symbolName} doesn't exist.`) : alert('Server error! Sorry.');
    });
});


module.exports = router;

