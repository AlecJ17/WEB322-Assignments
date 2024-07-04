/********************************************************************************
 *  WEB322 – Assignment 04
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Alec Josef Serrano Student ID: 133592238 Date: July 02, 2024
 *
 *  Published URL: ___________________________________________________________
 *
 ********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const legoData = require("./modules/legoSets");

const HTTP_PORT = process.env.PORT || 8080; // Use the environment variable or default to 8080

app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Specify the directory for EJS templates
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// Home route
app.get("/", (req, res) => {
  res.render("home"); // Render 'home.ejs'
});

// About route
app.get("/about", (req, res) => {
  res.render("about"); // Render 'about.ejs'
});

// Route to display all sets or filter by theme
app.get("/lego/sets", async (req, res) => {
  try {
    const { theme } = req.query; // Retrieve the theme from query parameters
    const sets = theme
      ? await legoData.getSetsByTheme(theme)
      : await legoData.getAllSets();
    res.render("sets", { sets: sets }); // Render 'sets.ejs' passing it the sets data
  } catch (error) {
    console.error("Failed to retrieve sets:", error);
    res.status(404).render("404", { message: "Error retrieving Lego sets." });
  }
});

// Route to display details for a specific set
app.get("/lego/sets/:setNum", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.setNum);
    if (set) {
      res.render("set", { set: set }); // Render 'set.ejs' passing it the specific set data
    } else {
      throw new Error("Set not found."); // Throw an error if no set was found
    }
  } catch (error) {
    console.error("Failed to retrieve set details:", error);
    res
      .status(404)
      .render("404", { message: "Unable to find the requested Lego set." });
  }
});

// 404 catch-all handler
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found." });
});

// Initialize Lego data and start the server
legoData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server is listening on port ${HTTP_PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize the Lego data module:", error);
  });
