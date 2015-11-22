// Dependencies
var mongoConnect = require('mongoconnect');
collectionName = 'kiva_col';

// Opens App Routes
module.exports = function(app) {

    var lenders_country_aggreg = [];
    var send_data;
    var isRunning = false;

    // POST loanRanking
    // --------------------------------------------------------
    // Retrieve Loan Rank in the db
    app.post('/queryRanks', function(req, res){
        if(isRunning) {
            return;
        }
        isRunning = true;
        console.log("Loan Ranking POST received");

        mongoConnect.execute(function(err, db) {
            if(err)
                console.log(agreg_err);

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
            collection.aggregate(
                [
                    {$match: {type: "loan", sector: {$in: sectorList}}},
                    {$group: 
                        { 
                            _id : "$country_code",
                            loan_ids: { $addToSet : "$id" },
                            total_loan: {$sum: "$loan_amount"},
                            total_lender: {$sum: "$lender_count"}
                        }
                    },
                    {$sort: {_id : -1}}
                ],
                function(agreg_err, agreg_res){
                    console.log("Aggregation returned.");
                    if(agreg_err)
                        console.log(agreg_err);

                    // If no errors, respond with a JSON of all users that meet the criteria
                    queryLendersByCountry(agreg_res);
                    isRunning = false;
                    return;
                });


                queryLendersByCountry = function(loans_aggreg) {
                    collection.aggregate(
                    [
                        {$match: {type: "lender"}},
                        {$group: 
                            { 
                                _id : "$country_code",
                                lender_ids: { $addToSet : "$lender_id" },
                                total_loan: {$sum: "$loan_count"},
                            }
                        },
                        {$sort: {_id : -1}}
                    ],
                    function(agreg_err, agreg_res){
                        console.log("Aggregation 2 returned.");

                        if(agreg_err)
                            console.log(agreg_err);

                        // If no errors, respond with a JSON of all users that meet the criteria
                        data = process_lenders_to_a_country(loans_aggreg, agreg_res);

                        res.json(data);
                        return;
                    });
                }

                process_lenders_to_a_country = function(loans_aggreg, lenders_by_country) {
                    var send_data = [];
                    var globalMin = 999999999;

                    for(i = 0; i < loans_aggreg.length; i++) {
                        found = false;

                        for(j = 0; j < lenders_by_country.length; j++) {
                            found = true;

                            if(loans_aggreg[i]._id == lenders_by_country[j]._id) {

                                meanLoan = loans_aggreg[i].total_loan / loans_aggreg[i].total_lender;
                                if(meanLoan < globalMin && meanLoan != 0) {
                                    globalMin = meanLoan    
                                }
                                
                                totalLends = meanLoan * lenders_by_country[j].total_loan;
                                debt = totalLends - loans_aggreg[i].total_loan;
                                
                                if (totalLends != null) {
                                    send_data.push({
                                        "country" : loans_aggreg[i]._id,
                                        "loans" : loans_aggreg[i].total_loan,
                                        "lends" : totalLends,
                                        "debt" : debt
                                    });
                                }
                            }
                        }

                        //No lender found
                        if(!found) {
                                debt = - loans_aggreg[i].total_loan;
                                
                                send_data.push({
                                    "country" : loans_aggreg[i]._id,
                                    "loans" : loans_aggreg[i].total_loan,
                                    "lends" : 0,
                                    "debt" : debt
                                });
                        }
                    }

                    for(j = 0; j < lenders_by_country.length; j++) {
                        found = false;
                        for(i = 0; i < loans_aggreg.length; i++) {
                            if(loans_aggreg[i]._id == lenders_by_country[j]._id) {
                                found = true;
                            }
                        }
                        
                        if(!found) {
                            totalLends = globalMin * lenders_by_country[j].total_loan;
                            debt = totalLends;
                            
                            send_data.push({
                                "country" : lenders_by_country[j]._id,
                                "loans" : 0,
                                "lends" : totalLends,
                                "debt" : debt
                            });
                        }
                    }

                    return send_data;
                }
        });
    });
};
