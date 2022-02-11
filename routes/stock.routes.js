const router = require("express").Router();
const Stock = require("../models/Stock.model.js");
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");

const axios = require('axios');
//const { redirect } = require("express/lib/response");
const keyPoly = 'fwL5228gSe7rxwQZLSKbd_r4Jo5YK_Zk'; //Key for Polygon Ticker stock API
const key = 'GXNI0400YMK2FWZM'; // Key for Alpha API
const functionName = 'TIME_SERIES_DAILY'; // Function for Alpha API

//CREATE - Buy a stock
  router.post('/stock-buy', (req, res, next) => {    
    const { stockNumber, buyingPrice, stockName } = req.body;

    if (!stockName) {
      return res.render("pages/depo.hbs", {
        errorMessage:
          "No stock has been choosen, please do and then press BUY, thanks!",
      });
    } else{
      Stock.create({ stockNumber, buyingPrice, stockName })
      .then(() => res.redirect('/stock-overview'))
      .catch((error) => {      
        if (error.code === 11000) {
          return res.render("pages/depo.hbs", {
            errorMessage:
              "Stock already purchased, please choose another one, thanks!",
          });
        }
      });
    }
  });

  //READ - read from DB
  router.get('/stock-overview', isLoggedIn, async (req, res, next) => {
    try {
      let stockOpenValue = [];

       let allTheStocksFromDB = await Stock.find()

        for (let i=0; i<allTheStocksFromDB.length; i++){
          const stockName1 = Object.values(allTheStocksFromDB[i].stockName); //ticker name + company name
          const symbolName = stockName1.join().replaceAll(",","").split(":")[0];
          const apiUrl = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbolName}&apikey=${key}`;

          let response = await axios.get(apiUrl);
          const axiosOutputData = response.data;
          let stockDates = Object.keys(axiosOutputData["Time Series (Daily)"]);
          const stockData = axiosOutputData["Time Series (Daily)"][stockDates[0]];
          let stockOpen = Object.values(stockData['1. open']);
          let newValue=(stockOpen.join().replaceAll(",",""))*1; //make sure it is a value
          stockOpenValue.push(newValue);
        }
        
        
        var stockInfoOutput = allTheStocksFromDB.map((e, i) => ({...e._doc ,  stockValue :stockOpenValue[i]})); 
        
        res.render("pages/stockoverview.hbs", { stockInfoOutput });
    }
    catch (error) {
      console.log("Error while getting the stocks from the DB: ", error);      
      next(error);
    } 
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
          .then((stockInfoOutput) => {
          return res
          .render("pages/stockoverview.hbs", { stockInfoOutput, errorMessage: "You are selling more than you have - Try again, only with partly of your amount" });
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