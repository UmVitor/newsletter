const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running");
});
app.use(express.static("public"));
app.get("/",function(req,res){
    
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const emailUser = req.body.emailUser;
    const data = {
        members: [
            {
                email_address: emailUser,
                status_if_new: "subscribed",
                status: "subscribed",
                merge_fields: {
                    FNAME: FirstName,
                    LNAME: LastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const listID = "YOUR-LISTS_IDs";
    const UserKey = "INSERT-HERE-THE-USER-KEY";
    const url = "https://us1.api.mailchimp.com/3.0/lists/" + listID;
    const options = {
        url: url,
        method: "POST",
        headers: {
            Authorization: 'auth ' + UserKey
        },
        body: jsonData
    };

    request(options, function(err, response, body){
        if(emailUser == null || response.statusCode != 200 || emailUser == ""){            
            console.log(response.statusCode);
            console.log(emailUser);
            res.sendFile(__dirname + "/failure.html");
        }else{            
            console.log(response.statusCode);
            res.sendFile(__dirname + "/success.html");
        }
    });
//Outra forma de fazer
//     const request = https.request(url, options, function(response){
        
//         if(response.statusCode == 200 && emailUser != null && emailUser != ""){            
//             res.sendFile(__dirname + "/success.html");
//         }
//         else{
//             res.sendFile(__dirname + "/failure.html");
            
//         }
//         response.on("data",function(data){
//             console.log(JSON.parse(data));
//         })
//     });

//     request.write(jsonData);
//     request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/")
});

