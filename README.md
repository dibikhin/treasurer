# Treasurer
Managing accounts' balances. A billing's core subsystem.

## Motivation

Suppose you have a chargeable service with some users and they pay you money. You need to store their amounts of money and charge them for using your service. And users should spend only money they have.

Treasurer operates on that.

## Features

Treasurer stores balances, deposits and withdraws funds, transfers funds between accounts.

Use Treasurer in telecom, messaging, payment systems, online games and shops.

You can store balances using a specific currency or abstract points.

It does:
* Created simple and well documented
* Operate syncronously
* Scale horisontally on each layer
* Work fast, reliably, fault-tolerant
* Serve transparently
* Use precise 128-bit IEEE 754-2008 decimal

It doesn't:
* Keep record of every balance movement
* Operate asynchronously

## Domain model

| Entity   | Desc              |
| -------- | ------------------- |
| User     | User of the system  |
| Funds     | User's money  |
| Account     | Record for keeping User's funds ('money balance')  |

### Account attributes

| Attribute  | Desc              |
| -------- | ------------------- |
| Balance     | Signed decimal amount of funds in Account  |
| Threshold     | Lower limit of available funds (e.g. zero) |
| Overdraft? |  |
| Credit? |  |
| Currency code | by standard |
| Accuracy? | Digits after zero |

| Attribute  | Desc              |
| -------- | ------------------- |
| State | active / suspended |
| Deleted | true / false |
| Created At UTC |  |
| Updated At UTC |  |


## Rules

* Account's Balance should be above Threshold (before and after spending)
* Each spending should be made in Account (and only once, and immidiately)
* Each storing should be made in Account (and only once, and immidiately)

## Features

### Story: Funds deposit

 *As a* user  
 *In order to* recieve a service  
 *I want to* deposit movey

#### Scenario 1: Funds should be increased after deposit  

*Given that* User's account has zero balance  
*And* the account is active  
*And* the account is not deleted  
*When* the User tries to deposit the amount of money  
*Then* the account's balance should be increased by the amount  

### Story: Funds withdrawal

 *As a* user  
 *In order to* recieve a service  
 *I want to* spend funds  

#### Scenario 1: Funds above threshold should be withdrawn  

*Given that* User's account has balance above threshold  
*And* the account is active  
*And* the account is not deleted  
*And* the balance minus spending is above threshold  
*When* the User tries to spend the amount of money  
*Then* the account's balance should be reduced by the amount  

#### Scenario 2: Funds below threshold should not be withdrawn

*Given that* User's account has balance below threshold  
*And* the account is active  
*And* the account is not deleted  
*When* the user tries to spend the amount of money  
*Then* the account's balance should not be changed  

#### Scenario 3: Funds above threshold should stay above threshold

*Given that* User's account has balance above threshold  
*And* the account is active  
*And* the account is not deleted  
*And* the amount minus spending is below threshold  
*When* the User tries to spend the amount of money  
*Then* the account's balance should not be changed  

## Requirements
* .NET Core
* Node.js

## Components
* accounts_api. API for managing Balance and Account CRUD
* TestApi. Dummy web app at http://localhost:5000. Returns a string on `GET /`
* FuncTester. Console app. Pings http://localhost:5000/ and prints result to console.

## Accounts API

### Balance endpoint
Get balance, deposit, withdraw, transfer.

### Account endpoint
CRUD. Excluding Account.Balance.

### Caching rules
Last value of balance should be cached for a while due to rule of keeping balance above threshold
(each withdrawal starts with balance checking).
* On balance: return cached value if TTL or return live version and add it to cache
* On deposit: remove from cache
* On withdraw: check balance
* On transfer: check balance

## Guide
Start TestApi then start FuncTester. The terminal should be flooded with ping messages.

### Starting TestApi
Open a terminal in Treasurer's folder, then:

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
Open another terminal in Treasurer's folder, then:

``` 
cd FuncTester
dotnet restore
```
...then
```
dotnet run
```
Look at the terminal.
