const router = require("express").Router();
const axios = require('axios');
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
res.render("index.hbs");
});

router.get("/depo", isLoggedIn, (req, res, next) => {
  res.render("pages/depo.hbs");
});

  const keyPoly = 'fwL5228gSe7rxwQZLSKbd_r4Jo5YK_Zk'; //Key for Polygon Ticker stock API
  const key = 'GXNI0400YMK2FWZM'; // Key for Alpha API
  const functionName = 'TIME_SERIES_DAILY'; // Function for Alpha API
  
  //Searching Stock By Name - Polygon API:
  router.get("/stock-search-name", (req, res, next) => {
  
    const compName = req.query.stocks;
    const apiUrl = `https://api.polygon.io/v3/reference/tickers?active=true&apiKey=${keyPoly}&search=${compName}`;
  
      axios
      .get(apiUrl)
      .then(response => {
        const data = response.data.results;
        // let stockValue = Object.keys(response.data.results[0])
        
        //if there is no stock with given input, error message should be send till user
        if (data.length===0){
          return res
          .status(400)
          .render("pages/depo.hbs", { errorMessage: `The stock "${compName}" doesn't exist.` });
        }
        
        else{
          let tickerData=[];
          let nameData=[];
          for(let key in data) {
            tickerData.push(data[key].ticker);
            nameData.push(data[key].name);
          }

          var stockInfo = tickerData.map((e, i) => e + ": " + nameData[i]); 
          res.render("pages/depo.hbs", { stockInfo })
         }
      })
      .catch(err => {
        console.log(err);
        err.response.status === 404 ? alert(`The stock ${compName} doesn't exist.`) : alert('Server error! Sorry.');
      });
  });

 //Searching Stock By Symbol - Alpha API:  
 router.get("/stock-search", (req, res, next) => {
  
  let symbolName = req.query.stocks.split(":")[0]; //ticker name
  const stockInfoBuy = req.query.stocks; //ticker name + company name
  const apiUrl = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbolName}&apikey=${key}`;
  
  axios
    .get(apiUrl)
    .then(response => {
      const axiosOutputData = response.data
      let stockDates = Object.keys(axiosOutputData["Time Series (Daily)"]);
      const stockData = axiosOutputData["Time Series (Daily)"][stockDates[0]];
      let stockOpen = Object.values(stockData['1. open']);
      let stockOpenValue = stockOpen.join().replaceAll(",","");
      let stockHigh = Object.values(stockData['2. high']);
      let stockHighValue = stockHigh.join().replaceAll(",","");
      let stockLow = Object.values(stockData['3. low']);
      let stockLowValue = stockLow.join().replaceAll(",","");

      res.render("pages/depo.hbs", { symbolName, stockInfoBuy, stockOpenValue, stockHighValue, stockLowValue });
    })
    .catch((err) => {
      console.log(err);
      err.response.status === 404
        ? alert(`The stock ${symbolName} doesn't exist.`)
        : alert("Server error! Sorry.");
    });
});

module.exports = router;

//Searching Stock By Symbol - Polygon API:
 /* router.get("/stock-search", (req, res, next) => {
  
    const symbolName = req.query.stocks;
    //console.log(`userinput ${symbolName}`)
    
    const apiUrl = `https://api.polygon.io/v1/open-close/${symbolName}/2022-02-07?adjusted=true&apiKey=${keyPoly}`;
    
        axios
        .get(apiUrl)
        .then(response => {
      
        //const polyOutputData = response;
      const stockData = response.data;
      const stockSymbol = stockData.symbol;
      console.log(stockData.symbol);
      const stockPrice = stockData.open;
      console.log(`Open: ${stockData.open}`);


      console.log(`High: ${stockData.high}`);
      console.log(`Low: ${stockData.low}`);
    
       res.render("pages/depo.hbs", { stockSymbol, stockPrice })
    
        })
    .catch(err => {
    console.log(err);
    err.response.status === 404 ? alert(`The stock ${symbolName} doesn't exist.`) : alert('Server error! Sorry.');
      });
    });*/






