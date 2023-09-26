 

## how to run in postman => 

### INSTALL DEPENDENCY => EXPRESS, NODEMON,jsonwebtoken,BODY-PARSER

1. make post request for 'localhost:8000/login' and insert any of the three users provided for example { "id": 3, "username": "user3", "password": "password3" } in json form in the body.

2. get the token generated 

3. now put the token in headers in key value form 

   ->  `Authorization |  token generated`

4. now we are ready to check any route 

`localhost:8000/country/Canada` =>  gives all data about canada

5. 

### endpoints =>  

#### FIRST ORDER FILTERATION=>

`/countries` => gives data of all contries

a) `/countries?Amin=100`  => gives countries with area greater than 100

 b) `/countries?Amin=100&Amax=1000` => gives countries with area greater than 100 and less than 1000
 
c) `/countries?Amax=1000` => gives countries with area less than 1000

d) `/countries?Pmax=1000000`  => gives countries with population less than 1000000

e) `/countries?Pmin=10000`  => gives countries with population greater than 10000

f) `/countries?asort=asc` => sort countries with ascending order of their area 

g) `/countries?asort=desc` => sort countries with descending order of their area 

h) `/countries?psort=asc` => sort countries with ascending order of their population 

i) `/countries?psort=desc` => sort countries with descending order of their population

j) `/countries?lang=English`  => gives countries where English is spoken

#### SECOND ORDER FILTERATION=>

k) `/countries?Amin=100&Amax=10000`  => gives contry with area b/w 100 and 1000 (both 100 and 10000 excluded)

l) `/countries?Pmin=100&Pmax=100000 `=> gives contry with population b/w 100 and 10000 (both 100 and 10000 excluded)

m) `/countries?Amin=100&asort=asc`  => gives country with area greater than Amin and sort by area ascending order

n) `/countries?Amin=100&asort=desc`  => gives country with area greater than Amin and sort by area descending order

o) `/countries?Amax=10000&asort=asc` => gives country with area less than Amax and sort by area ascending order 

p) `/countries?Pmin=1000&psort=asc`  => gives country with population greater than Pmin and sort by population ascending order

q) `/countries?Pmin=1000&psort=desc`  => gives country with population greater than Pmin and sort by population descending order

r) `/countries?Pmax=100000&psort=desc`  => gives country with population less than Pmax and sort by population descending order

similarly above can be written for ascending order with psort=asc

s) `/countries?lang=English&Amin=1000` => gives contry with a language english and area greater than Amin

t) `/countries?lang=English&Amax=1000000` => gives contry with a language english and area less than Amax

#### 3RD ORDER FILTERATION=> 

u) `/countries?lang=English&Amax=100000&Amin=100` => gives contry with a language and area greater than Amin and area less than Amax

v) `/countries?lang=English&Pmax=100000&Pmin=100` => gives contry with a language and area greater than Amin and area less than Amax

w) `/countries?lang=English&Amax=10000&asort=asc ` => contry with a language english area less than Amax sorted by area ascending order

x) `/countries?lang=English&Amin=10000&asort=desc`  => contry with a language english area greater than Amin sorted by area descending order

y) `/countries?lang=English&Pmin=300&psort=asc` => contry with a language english population greater than Pmin sorted by population ascending order

z) `/countries?lang=English&Pmin=300&psort=desc` => contry with a language english population greater than Pmin sorted by population descending order

a1) `/countries?lang=English&Pmax=30000&psort=desc` => contry with a language english population less than Pmax sorted by population descending order

a2) `/countries?lang=English&Pmax=30000&psort=asc` => contry with a language english population less than Pmax sorted by population ascending order

a3) `/countries?lang=English&Pmax=30000&psort=desc` => contry with a language  english population less than Pmax sorted by population descending order

#### 4th order filtering =>

a4)`/countries?Amin=100&Amax=100000&Pmin=2000&Pmax=200000` => gives contry with area b/w Amin and Amax and population b/w Pmin and Pmax

a5) `/countries?lang=English&Amin=100&Amax=100000&asort=asc` => contry with language english area greater than Amin ,less than Amax sorted by area ascending order


till this point url structuring is clear => just writing urls to check 

=> `/countries?lang=English&Pmin=400&Pmax=200000&psort=asc`

=> `/countries?lang=English&Pmin=400&Pmax=200000&psort=desc`

=> `/countries?lang=English&Pmin=400&Pmax=200000&psort=asc`

=> `/countries?lang=English&Pmin=400&Pmax=200000&asort=asc`

=> `/countries?lang=English&Pmin=400&Pmax=200000&asort=desc`

=> `/countries?lang=English&Amin=400&Amax=200000&psort=desc`

=> `/countries?lang=English&Amin=400&Amax=200000&psort=asc`

=> `/countries?lang=English&Amin=400&Pmax=200000&asort=asc`

#### 5th order filtering => 

=> `/countries?Amin=400&Amax=2000&Pmin=300&Pmax=20000000&asort=asc`

=>`/countries?Amin=400&Amax=2000&Pmin=300&Pmax=20000000&psort=desc`

=> `/countries?lang=English&Amin=400&Amax=2000&Pmin=300&Pmax=20000000 `

#### 6th order filtering=>

country with particular language which has area b/w Amin and Amax and population b/w Pmin and Pmax sorted by area in descending order

=> `/countries?lang=English&Amin=40&Amax=20000&Pmin=300&Pmax=20000000&asort=desc`

country with particular language which has area b/w Amin and Amax and population b/w Pmin and Pmax sorted by population in ascending order

=> `/countries?lang=English&Amin=40&Amax=20000&Pmin=300&Pmax=20000000&psort=asc`

endpoints to check Pagination => 

`/countries?lang=English&Amin=40&Amax=20000&Pmin=300&Pmax=20000000&psort=asc&page=1&pagelimit=10` => it will show 10 contries on page 1

=>  `/countries?lang=English&Amin=40&Amax=20000&Pmin=300&Pmax=20000000&asort=desc&page=1&pagelimit=20`  => total 20 data it will show of first page

=>  `/countries?lang=English&Pmin=400&Pmax=200000&psort=asc&page=2&pagelimit=20`   => it will show 20 data of second page 


#### Note: there are many other possibilities of filteration 

for example 

##### filter the country which has area less than Amax and population greater than Pmin sort by population and language is something 

`/countries?Amax=10000&Pmin=100&psort=asc`

`/countries?lang=English&Amax=10000&Pmin=100psort=asc`

to code above filters 

just call nested function  and give the returned value to respond function 

for this=> `/countries?Amax=10000&Pmin=100&psort=asc`
```
if(!Amin && Amax && !asort && Pmin && !Pmax && psort && !lang){
   let countryname=maxArea(Amax,minPopulation(Pmin,pSort(psort,response)))
   respond(countryname)
}
```

in above way we can code for all possible filters

