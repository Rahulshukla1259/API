const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
let express = require("express");

require("dotenv").config();

let app = express();

const port = 7000;

let SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());

app.use(bodyParser.json());

//users allowed to login
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
  { id: 3, username: "user3", password: "password3" },
];

// post user data to login
app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    // Find the user by username
    const user = users.find((u) => u.username === username);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "3h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
   const token = req.headers.Authorization;
  
  
  if (!token) {
    return res.status(403).json({ message: "Unauthorized user" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized user" });
    }

    req.userId = decoded.userId;
    next();
  });
}
//  get contryname by passing params and middleware passed to protect route
app.get("/country/:countryName",verifyToken, async (req, res) => {
  try {
    const countryName = req.params.countryName;
 
    // Make a request to the REST Countries API
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    const countryData = await response.json();

    // Check if the country exists in the API response
    if (Array.isArray(countryData) && countryData.length > 0) {
      res.json(countryData[0]);
    } else {
      res.status(404).json({ error: "Country not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get all contries name by applying desired filters
app.get("/countries", verifyToken, (req, res) => {
  try {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((response) => {
        let {
          Amin, //min area limit in query
          Amax, // max area limit in query
          asort, //sort by area values taken is asc ,desc
          psort, //sort by population values taken is asc ,desc
          lang, //language of contries
          Pmin, //minimum population
          Pmax, //maximum population
          page, // no of pages to show
          pagelimit, // no of contries in one page
        } = req.query;

        let countryname = [];

        //function to filter contries with min area
        let minArea = (Amin, data) => {
          countryname = data.filter((cont) => cont.area > Amin);

          return countryname;
        };

        //function to filter contries with max area
        let maxArea = (Amax, data) => {
          countryname = data.filter((cont) => cont.area < Amax);

          return countryname;
        };

        //function to filter contries with min population
        let minPopulation = (Pmin, data) => {
          countryname = data.filter((cont) => cont.population > Pmin);

          return countryname;
        };

        //function to filter contries with max population
        let maxPopulation = (Pmax, data) => {
          countryname = data.filter((cont) => cont.population < Pmax);

          return countryname;
        };

        //sort by area

        let aSort = (asort, data) => {
          if (asort == "asc") {
            countryname = data.sort((a, b) => a.area - b.area);

            return countryname;
          }

          if (asort == "desc") {
            countryname = data.sort((a, b) => b.area - a.area);

            return countryname;
          }
        };

        // sort by population
        let pSort = (psort, data) => {
          if (psort == "asc") {
            countryname = data.sort((a, b) => a.population - b.population);

            return countryname;
          }

          if (psort == "desc") {
            countryname = data.sort((a, b) => b.population - a.population);

            return countryname;
          }
        };

        // find contry with particular language
        let languageFilter = (lang, data) => {
          countryname = data.filter((cont) => {
            if (cont.languages != null) {
              return Object.values(cont.languages).includes(lang);
            }
          });

          return countryname;
        };
        //response function
        function respond(filteredData) {
          countryname = filteredData.map((cont) => {
            return cont.name.common;
          });
          // handeling pages
          if (page && pagelimit) {
            countryname = countryname.slice((page-1)*pagelimit, page * pagelimit);
          }

          if(countryname.length===0){

            res.json({message:"no country found"})
          } else{

            res.json({ country: countryname });
          }
        }

        // checking if query is there then calling the function
        //zero order filtering 
        if (!Amin && !Amax && !asort && !Pmin && !Pmax && !psort && !lang){

          res.json(response)
        }

        //  first order filtering
        //filter with min area only
        if (Amin && !Amax && !asort && !Pmin && !Pmax && !psort && !lang) {
          let countryname = minArea(Amin, response);
          respond(countryname);
        }
        // filter with max area only
        if (!Amin && Amax && !asort && !Pmin && !Pmax && !psort && !lang) {
          let countryname = maxArea(Amax, response);
          respond(countryname);
        }
        // filter with min population
        if (!Amin && !Amax && !asort && Pmin && !Pmax && !psort && !lang) {
          let countryname = minPopulation(Pmin, response);
          respond(countryname);
        }
        // filter with max population
        if (!Amin && !Amax && !asort && !Pmin && Pmax && !psort && !lang) {
          let countryname = maxPopulation(Pmax, response);
          respond(countryname);
        }

      
        // sort country by area
        if (!Amin && !Amax && asort && !Pmin && Pmax && !psort && !lang) {
          let countryname = aSort(asort, response);
          respond(countryname);
        }
        // sort country by population
        if (!Amin && !Amax && !asort && !Pmin && !Pmax && psort && !lang) {
          let countryname = pSort(psort, response);
          respond(countryname);
        }
        // filter contry with language
        if (!Amin && !Amax && !asort && !Pmin && !Pmax && !psort && lang) {
          let countryname = languageFilter(lang, response);
          respond(countryname);
        }
        //  2nd order filtering
        //filter country with area greater than Amin and less than Amax

        if (Amin && Amax && !asort && !Pmin && !Pmax && !psort && !lang) {
          let countryname = maxArea(Amax, minArea(Amin, response));
          respond(countryname);
        }

        //filter country with population greater than Pmin and less than Pmax

        if (!Amin && !Amax && !asort && Pmin && Pmax && !psort && !lang) {
          let countryname = maxPopulation(Pmax, minPopulation(Pmin, response));
          respond(countryname);
        }

        //filter country with area greater than Amin and sort by area

        if (Amin && !Amax && asort && !Pmin && !Pmax && !psort && !lang) {
          let countryname = aSort(asort, minArea(Amin, response));
          respond(countryname);
        }

        //filter country with area less than Amax and sort by area

        if (!Amin && Amax && asort && !Pmin && !Pmax && !psort && !lang) {
          let countryname = aSort(asort, maxArea(Amin, response));
          respond(countryname);
        }

        //filter country with population greater than Pmin and sort by population

        if (!Amin && !Amax && !asort && Pmin && !Pmax && psort && !lang) {
          let countryname = pSort(psort, minPopulation(Pmin, response));
          respond(countryname);
        }

        //filter country with population less than Pmax and sort by population

        if (!Amin && !Amax && !asort && !Pmin && Pmax && psort && !lang) {
          let countryname = pSort(psort, maxPopulation(Pmax, response));
          respond(countryname);
        }

        //filter contry with a language and area greater than Amin

        if (Amin && !Amax && !asort && !Pmin && !Pmax && !psort && lang) {
          let countryname = languageFilter(lang, minArea(Amin, response));
          respond(countryname);
        }

        //filter contry with a language and area less than Amax

        if (!Amin && Amax && !asort && !Pmin && !Pmax && !psort && lang) {
          let countryname = languageFilter(lang, maxArea(Amax, response));
          respond(countryname);
        }

        //filter contry with a language and population greater than Pmin

        if (!Amin && !Amax && !asort && Pmin && !Pmax && !psort && lang) {
          let countryname = languageFilter(lang, minPopulation(Pmin, response));
          respond(countryname);
        }

        //filter contry with a language and population less than Pmax

        if (!Amin && !Amax && !asort && !Pmin && Pmax && !psort && lang) {
          let countryname = languageFilter(lang, maxPopulation(Pmax, response));
          respond(countryname);
        }

        // 3rd order filtering

        //filter contry with a language and area greater than Amin and area less than Amax

        if (Amin && Amax && !asort && !Pmin && !Pmax && !psort && lang) {
          let countryname = languageFilter(
            lang,
            maxArea(Amax, minArea(Amin, response))
          );
          respond(countryname);
        }

        //filter contry with a language and population greater than Pmin and population less than Pmax

        if (!Amin && !Amax && !asort && Pmin && Pmax && !psort && lang) {
          let countryname = languageFilter(
            lang,
            maxPopulation(Pmax, minPopulation(Pmin, response))
          );
          respond(countryname);
        }

        // filter contry with a language area less than Amax sorted by area

        if (!Amin && Amax && asort && !Pmin && !Pmax && !psort && lang) {
          let countryname = languageFilter(
            lang,
            maxArea(Amax, aSort(asort, response))
          );
          respond(countryname);
        }

        // filter contry with a language area greater than Amin sorted by area

        if (Amin && !Amax && asort && !Pmin && !Pmax && !psort && lang) {
          let countryname = languageFilter(
            lang,
            minArea(Amin, aSort(asort, response))
          );
          respond(countryname);
        }

        // filter contry with a language population greater than Pmin sorted by population

        if (!Amin && !Amax && !asort && Pmin && !Pmax && psort && lang) {
          let countryname = languageFilter(
            lang,
            minPopulation(Pmin, pSort(psort, response))
          );
          respond(countryname);
        }

        // filter contry with a language population less than Pmax sorted by population

        if (!Amin && !Amax && !asort && !Pmin && Pmax && psort && lang) {
          let countryname = languageFilter(
            lang,
            maxPopulation(Pmax, pSort(psort, response))
          );
          respond(countryname);
        }

        // 4TH OREDER FILTERING

        //contry with area b/w Amin and Amax and population b/w Pmin and Pmax

        if (Amin && Amax && !asort && Pmin && Pmax && !psort && !lang) {
          let countryname = maxPopulation(
            Pmax,
            minPopulation(Pmin, maxArea(Amax, minArea(Amin, response)))
          );
          respond(countryname);
        }

        //filter contry with language area greater than Amin ,less than Amax sorted by area

        if (Amin && Amax && asort && !Pmin && !Pmax && !psort && lang) {
          let countryname = languageFilter(
            lang,
            maxArea(Amax, minArea(Amin, aSort(asort, response)))
          );
          respond(countryname);
        }

        //filter contry with language population greater than Pmin ,less than Pmax sorted by population

        if (!Amin && !Amax && !asort && Pmin && Pmax && psort && lang) {
          let countryname = languageFilter(
            lang,
            maxPopulation(Pmax, minPopulation(Pmin, pSort(psort, response)))
          );
          respond(countryname);
        }

        //filter contry with language population greater than Pmin ,less than Pmax sorted by area

        if (!Amin && !Amax && asort && Pmin && Pmax && !psort && lang) {
          let countryname = languageFilter(
            lang,
            maxPopulation(Pmax, minPopulation(Pmin, aSort(asort, response)))
          );
          respond(countryname);
        }

        //filter contry with language area greater than Amin ,less than Amax sorted by population

        if (Amin && Amax && !asort && !Pmin && !Pmax && psort && lang) {
          let countryname = languageFilter(
            lang,
            maxArea(Amax, minArea(Amin, pSort(psort, response)))
          );
          respond(countryname);
        }

        //filter contry with language area greater than Amin ,population greater than Pmin sorted by area

        if (Amin && !Amax && asort && Pmin && !Pmax && !psort && lang) {
          let countryname = languageFilter(
            lang,
            minArea(Amin, minPopulation(Pmin, aSort(asort, response)))
          );
          respond(countryname);
        }

        //filter contry with language area greater than Amin ,population less than Pmax sorted by area

        if (Amin && !Amax && asort && Pmin && !Pmax && !psort && lang) {
          let countryname = languageFilter(
            lang,
            minArea(Amin, maxPopulation(Pmax, aSort(asort, response)))
          );
          respond(countryname);
        }

        //5th order filtering

        //contry with area b/w Amin and Amax and population b/w Pmin and Pmax sorted by area

        if (Amin && Amax && asort && Pmin && Pmax && !psort && !lang) {
          let countryname = maxPopulation(
            Pmax,
            minPopulation(
              Pmin,
              maxArea(Amax, minArea(Amin, aSort(asort, response)))
            )
          );
          respond(countryname);
        }

        //contry with area b/w Amin and Amax and population b/w Pmin and Pmax sorted by Population

        if (Amin && Amax && !asort && Pmin && Pmax && psort && !lang) {
          let countryname = pSort(psort, maxPopulation(
            Pmax,
            minPopulation(
              Pmin,
              maxArea(Amax, minArea(Amin,response))
            )
          ));
          respond(countryname);
        }

        //contry with a language and area b/w Amin and Amax and population b/w Pmin and Pmax

        if (Amin && Amax && !asort && Pmin && Pmax && !psort && lang) {
          let countryname = languageFilter(
            lang,
            maxPopulation(
              Pmax,
              minPopulation(Pmin, maxArea(Amax, minArea(Amin, response)))
            )
          );

          respond(countryname);
        }

        //6th order filtering

        //contry with a language and area b/w Amin and Amax and population b/w Pmin and Pmax sorted by area

        if (Amin && Amax && asort && Pmin && Pmax && !psort && lang) {
          let countryname = languageFilter(
            lang,
            maxPopulation(
              Pmax,
              minPopulation(
                Pmin,
                maxArea(Amax, minArea(Amin, aSort(asort, response)))
              )
            )
          );
        
          respond(countryname);
        }

        //contry with a language and area b/w Amin and Amax and population b/w Pmin and Pmax sorted by population

        if (Amin && Amax && !asort && Pmin && Pmax && psort && lang) {
          let countryname = languageFilter(
            lang,
            maxPopulation(
              Pmax,
              minPopulation(
                Pmin,
                maxArea(Amax, minArea(Amin, pSort(psort, response)))
              )
            )
          )
          respond(countryname);
        }
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`listening at ${port} `);
});
