const router = require("express").Router();
const Stock = require("../models/Stock.model.js");
const mongoose = require("mongoose");

//CREATE - Buy a stock
  router.post('/stock-buy', (req, res, next) => {    
    console.log(req.body);
     const { stockNumber, buyingPrice, stockName } = req.body;
   
     Stock.create({ stockNumber, buyingPrice, stockName })
     .then(() => res.redirect('/stock-overview'))
     //.then(() => console.log("test"));
    // //.catch(error => next(error));
    // .catch(error => res.render('pages/depo.hbs'));
  });

  //READ - read from DB
  router.get('/stock-overview', (req, res, next) => {
    Stock.find()
      .then((allTheStocksFromDB) => {
        //console.log("Retrieved stocks from DB:", allTheStocksFromDB);
        res.render("pages/stockoverview.hbs", { stocks: allTheStocksFromDB });
      })
      .catch((error) => {
        console.log("Error while getting the stocks from the DB: ", error);      
        next(error);
      });
  });

  //UPDATE

  //DELETE
  router.post('/stock-sell/:id/delete', (req, res, next) => {
    const { id } = req.params;
   
    Stock.findByIdAndDelete(id)
      .then(() => res.redirect('/stock-overview'))
      .catch(error => next(error));
  });


  



  module.exports = router;