# Acckeeper
Users' accounts storage service (funds balance)

## Requirements
* .NET Core

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