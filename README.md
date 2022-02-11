# Easy Investor
## Description of the project
This is an simple and easy app to search out, buy and sell stocks. It alo comes with a deposit overview, of all the stocks you own.
## Instructions
You need to sign up, and here after you can start buying stocks. You can search for stocks to buy, in the Buy Stocks page. You can search for stocks by name input, and the API will return all stocks with a matching name. Here after you select the stock you want to buy, and this action will input the ticker symbol in the next API, so you can make a buy.
In the page Stock Overview, you can see the stocks you have purchased, and from here you can also sell the stocks again.
## Wireframes
![This is an image](https://github.com/dkbobenn/investment-app/blob/main/public/images/Wireframes_1.png)

![This is an image](https://github.com/dkbobenn/investment-app/blob/main/public/images/Wireframes_2.png)
## User Stories
### API:
- SEARCH (READ API): As a user I would like to be able to search for any stocks just by writing company name
- READ API(s): As a user, I would like to see key numbers (current price, highest and lowest for the day ) so that I have the daily overview
### DB:
- PORTFOLIO (READ in DB): As a user I would like to be able to see my stock portfolio and my purchase price and current price, so that I have the overview in one place.
- LOG IN: As a user I would like to be able to sign in to my account so that I can get access to my stock overview
- SIGN UP (CREATE): As a user I would like to be able to press on sign up button so that I can create an account
- BUY (CREATE in DB): As a user, I want to be able to press on buy button after typing in number so that I buy that amount of stocks.
- SELL (UPDATE/DELETE in DB): As a user, I would like to type in number that I would like to sell and then it will be sold
### Other:
- Make the styling
- Setup Heroku and Mongo Atlas connection
## Technologies Used
- Java Script.
- Node Express.
- Bcrypt.
- Axios - API Client
- Polygon API: https://api.polygon.io/v3/reference/tickers?active=true&apiKey=_r4Jo5YK_Zk&search=
- AlphaAvantage: https://www.alphavantage.co/query?function=&symbol=&apikey=
- hbs
- MongoDB Atlas
- Heroku
- HTML
- CSS
## Models
- User Model: Handling authorization and security
- Stock Model: Stock data
## Setup
You can find Easy Investor here:
https://buy-stocks.herokuapp.com/

MongoAtls is used as database.
## Team
Vibeke Granhøj Jørgensen and Bo Bennetsen:
https://github.com/dkbobenn/investment-app

## Future work
- Increase stability of the API`s.
- Styling of Signup and Login.
- Styling of Buy Stocks page.
- Styling of Stock Overview page.
- error messages for not successfull API calls.
- Stockchart to see how your deposit of stocks is performing.
- Feature that will give a prediction if the timing is right for buying or selling.
- You must only be able to see your own stock deposit, and not other users deposits.

## Server routes table(Method, Route or URL, Description as columns)
| Route                  | HTTP           | Description                      |
|------------------------|----------------|----------------------------------|
| /depo                  |GET             |Buy stocks page                   |
| /                      |GET             |Front page                        |
| /signup                |GET             |sign up route                     |
| /signup                |POST            |create user                       |
| /login                 |GET             |login route                       |
| /login                 |POST            |create session ID                 |
| /logout                |POST            |log out route                     |
| /stock-search-name     |GET             |stock data from Polygon API       |
| /stock-search          |GET             |stock data from Alphaavantage API |
| /stock-buy             |POST            |create - buy stocks               |
| /stock-overview        |GET             |read from database                |
| /stock-update/:id/edit |POST            |Sell stocks                       |
| /stock-sell/:id/delete |POST            |Delete - sell all stocks          |

## Resources
- MongoDB
- Mongoose
- Bootstrap
- Iron Launcher npm package
- Express npm package
- Axios npm package

