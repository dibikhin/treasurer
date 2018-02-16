# Acckeeper
Users' accounts storage service (funds balance)

## Domain model

| Entity   | Desc              |
| -------- | ------------------- |
| User     | User of the system  |
| Funds     | User's money  |
| Account     | Record for keeping User's funds ('money balance')  |
| Amount     | Signed decimal amount of funds in Account  |
| Threshold     | Lower limit of available funds (e.g. zero) |

## Rules

* Amount in Account always should be above Threshold (before and after spending)
* Each spending should be charged in Account (and only once, and immidiately)

## Features

### Story: Funds deposit

 *As a* user  
 *In order to* recieve a service  
 *I want to* deposit movey

#### Scenario 1: Funds should be increased after deposit  

*Given that* User's account has a zero amount  
*And* the account is active  
*And* the account is not deleted  
*When* the User tries to deposit the amount of money  
*Then* the account's amount should be increased by the amount  

### Story: Funds withdrawal

 *As a* user  
 *In order to* recieve a service  
 *I want to* spend funds  

#### Scenario 1: Funds above threshold should be withdrawn  

*Given that* User's account has an amount above threshold  
*And* the account is active  
*And* the account is not deleted  
*And* the amount minus spending is above threshold  
*When* the User tries to spend the amount of money  
*Then* the account's amount should be reduced by the amount  

#### Scenario 2: Funds below threshold should not be withdrawn

*Given that* User's account has an amount below threshold  
*And* the account is active  
*And* the account is not deleted  
*When* the user tries to spend the amount of money  
*Then* the account's amount should not be changed  

#### Scenario 3: Funds above threshold should stay above threshold

*Given that* User's account has an amount above threshold  
*And* the account is active  
*And* the account is not deleted  
*And* the amount minus spending is below threshold  
*When* the User tries to spend the amount of money  
*Then* the account's amount should not be changed  

## Requirements
* .NET Core
* Node.js

## Components
* TestApi. Dummy web app at http://localhost:5000. Returns a string on `GET /`
* FuncTester. Console app. Pings http://localhost:5000/ and prints result to console.

## Guide
Start TestApi then start FuncTester. The terminal should be flooded with ping messages.

### Starting TestApi
Open a terminal in Acckeeper's folder, then:

``` 
cd TestApi
dotnet restore
```
...then
```
dotnet run
```
Look at the terminal.

### Starting FuncTester
Open another terminal in Acckeeper's folder, then:

``` 
cd FuncTester
dotnet restore
```
...then
```
dotnet run
```
Look at the terminal.
