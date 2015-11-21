// Dependencies
var mongoConnect = require('mongoconnect');
collectionName = 'kiva_col';

// Opens App Routes
module.exports = function(app) {

    // POST loanRanking
    // --------------------------------------------------------
    // Retrieve Loan Rank in the db
    app.post('/queryRanks', function(req, res){

        console.log("Loan Ranking POST received");

        mongoConnect.execute(function(err, db) {
            if(err)
                res.send(err);

            console.log("Getting collection");
            var collection = db.collection(collectionName);

            var sectorList = req.body.sectors;

            if (sectorList.length == 0) {
                //Get all sectors
                sectorList = ["Agriculture", "Arts", "Clothing", "Construction", "Education", "Entertainment",
                              "Food", "Retail", "Health", "Personal Use", "Housing", "Manufacturing", "Services",
                              "Transportation", "Wholesale"];
            }

            console.log("Loan Ranking - doing aggregation");
            // collection.aggregate(
            //     [
            //         {$match: {type: "loan", sector: {$in: sectorList}}},
            //         {$group: 
            //             { 
            //                 _id : "$country_code",
            //                 total_loan: {$sum: "$loan_amount"},
            //                 total_lender: {$sum: "$lender_count"}
            //             }
            //         },
            //         {$sort: {total_loan : -1}}
            //     ],
            //     function(agreg_err, agreg_res){
            //         console.log("Aggregation returned.");
            //         console.log(agreg_res);
            //         if(agreg_err)
            //             res.send(agreg_err);

            //         // If no errors, respond with a JSON of all users that meet the criteria
            //         res.json(agreg_res);
            //     });

            //TEST
            dummy_data = [
                {"country" : "EC", "loans" : 2000, "lends" : 4000, "debt" : (4000 - 2000)},
                {"country" : "AZ", "loans" : 67567, "lends" : 67, "debt" : (67 - 67567)},
                {"country" : "TJ", "loans" : 20023540, "lends" : 234234, "debt" : (234234 - 20023540)}
            ];
            res.json(dummy_data);

        });
    });
};
