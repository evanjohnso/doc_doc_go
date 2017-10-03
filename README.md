# DocDocGo

#### By Evan Johnson

## Description

_Enter a location and the specialty you require and a list of doctors in the given
proximity will appear_

## First Time implementations
* Map/Filter to more efficiently iterate through data structures
* Session Storage to store information without a server
* Linking API calls together depending on previous return values with Promises
* Flex Box Model to load an uncertain amount of data
* Try/Catch blocks in API calls



## Setup/Installation Requirements

* Chrome
* Node

```console
  git clone https://github.com/evanjohnso/doc_doc_go.git
```

```console
  cd DocDocGo
```

```console
  npm install
```

```console
  get an API key from <a href="https://betterdoctor.com/developers/">BetterDoctors</a>
```

```console
  create .env file in root directory
```
  Save your API key as
```console
  exports.apiKey = 'your_API_key_here';

```

```console
  gulp serve
```



## Development Specifications
| Behavior      | Example Input         | Example Output        |
| ------------- | ------------- | ------------- |
| Enter Location && speciality | Seattle, Dentist  |  15 doctors in your area!  |

## Output Examples
![main screen](img/display1.png)
***
![After clicking on doctor](img/display2.png)
***



## Technologies Used

* _JavaScript_
* _Node_
* _Gulp_
* _Postman_

## Known Bugs
* If user enters New York and Dentist, the data returned is unable to be processed by the current code, need account for more variance in the JSON.
* Output of doctors is repeated, something wrong with the specialty doctor API call
* Reevaluate using try/catch block to handle API call errors


### License

MIT Copyright &copy; 2017 Evan Johnson
