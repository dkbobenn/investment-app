const router = require("express").Router();
const Stock = require("../models/Stock.model.js");
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");

const axios = require('axios');
const keyPoly = 'fwL5228gSe7rxwQZLSKbd_r4Jo5YK_Zk'; //Key for Polygon Ticker stock API
const key = 'GXNI0400YMK2FWZM'; // Key for Alpha API
const functionName = 'TIME_SERIES_DAILY'; // Function for Alpha API

var stockOpenArray = [];

//CREATE - Buy a stock
  router.post('/stock-buy', (req, res, next) => {    
//    console.log(req.body);
     const { stockNumber, buyingPrice, stockName } = req.body;
   
     Stock.create({ stockNumber, buyingPrice, stockName })
     .then(() => res.redirect('/stock-overview'))
  });

  //READ - read from DB
  // router.get('/stock-overview', (req, res, next) => {
  //   Stock.find()
  //     .then((allTheStocksFromDB) => {
  //       res.render("pages/stockoverview.hbs", { stocks: allTheStocksFromDB });
  //     })
  //     .catch((error) => {
  //       console.log("Error while getting the stocks from the DB: ", error);      
  //       next(error);
  //     });
  // });

  router.get('/stock-overview', isLoggedIn, (req, res, next) => {
    Stock.find()
      .then((allTheStocksFromDB) => {
        for (let i=0; i<allTheStocksFromDB.length; i++){
          const stockName1 = Object.values(allTheStocksFromDB[i].stockName); //ticker name + company name
          const symbolName = stockName1.join().replaceAll(",","").split(":")[0];
          console.log(symbolName)

          const apiUrl = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbolName}&apikey=${key}`;

          axios
          .get(apiUrl)
          .then(response => {
            
            const axiosOutputData = response.data
            let stockDates = Object.keys(axiosOutputData["Time Series (Daily)"]);
            const stockData = axiosOutputData["Time Series (Daily)"][stockDates[0]];
            let stockOpen = Object.values(stockData['1. open']);
            let stockOpenValue = stockOpen.join().replaceAll(",","");
            //stockOpenArray[i].test = stockOpenValue;
            console.log(stockOpenValue);
            return stockOpenValue;
            //console.log(allTheStocksFromDB);
            //allTheStocksFromDB.push({"currentValue:" stockOpenValue})
      
          })
          
        }
      
        console.log("test")
        //console.log(stockOpenValue)
        res.render("pages/stockoverview.hbs", { stocks: allTheStocksFromDB});
        
        
      
       // console.log(allTheStocksFromDB)
      
      })
      .catch((error) => {
        console.log("Error while getting the stocks from the DB: ", error);      
        next(error);
      });
  });

  //UPDATE - sell partly
  router.post('/stock-update/:id/edit', (req, res, next) => {
    const { id } = req.params;
    let sellStock = parseInt(req.body.update);
  
    Stock.findById(id)
      .then((stockInfo) =>{
      stockNumber = stockInfo.stockNumber - sellStock;
      //try to sell more than you have
      if (stockNumber<0) {
        Stock.find()
          .then((allTheStocksFromDB) => {
          return res
          .status(400)
          .render("pages/stockoverview", { stocks: allTheStocksFromDB, errorMessage: "You are selling more than you have - Try again, only with partly of your amount" });
          })
          .catch((error) => {
            console.log("Error while getting the stocks from the DB: ", error);      
            next(error);
          });
      }
      //You are selling all - DELETE
      else if (stockNumber===0) {
          Stock.findByIdAndDelete(id)
            .then(() => res.redirect('/stock-overview'))
            .catch(error => next(error));
      } 
      // partly sale - happy path
      else{
      Stock.findByIdAndUpdate(id, { stockNumber }, { new: true })
        .then(() => {
          //console.log(Object.values(stockInfo));
          res.redirect('/stock-overview')
        })
        .catch(error => next(error));
      }
    })
    
    .catch((err) => next(err));
  });

  //DELETE
  router.post('/stock-sell/:id/delete', (req, res, next) => {
    const { id } = req.params;
   
    Stock.findByIdAndDelete(id)
      .then(() => res.redirect('/stock-overview'))
      .catch(error => next(error));
  });

  module.exports = router;