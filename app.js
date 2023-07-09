const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const listId = "..."; // Replace with your actual list ID
  const server = "us21"; // Replace with your server prefix (e.g., us1, us2)
  const apiKey = "..."; // Replace with your actual API key

  mailchimp.setConfig({
    apiKey: apiKey,
    server: server,
  });

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      });

      console.log("Successfully added subscriber with email: ", response.email_address);
      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      console.error("Error adding subscriber: ", error);
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
});

app.listen(process.env.PORT || "3000", function () {
  console.log("The server is listening on port 3000");
});


