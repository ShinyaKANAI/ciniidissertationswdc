(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "title",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "creator",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "publisher",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "degreeName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "dissertationNumber",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "date",
            dataType: tableau.dataTypeEnum.date
        },{
            id: "link",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "ciniiDisertations",
            alias: "CiNii Disertations list",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback){
        $.getJSON("https://ci.nii.ac.jp/d/search?advanced=true&count=100&sortorder=1&range=0&degreename=%E5%8D%9A%E5%A3%AB&format=json", function(resp) { //Test query to get first 100 result.
            // documentation : https://support.nii.ac.jp/ja/cid/api/d_json
            tableau.log("getJSON called"); // debug
            var itm = resp["@graph"][0].items, // ["@graph"].items, search results in it.
                tableaData = [];
            tableau.log("ready to get data"); // debug
            
            // Iterate over the JSON object
            for (var i = 0, len = itm.length; i < len; i++) {
                tableaData.push({
                    "id": itm[i]["@id"],
                    "title": itm[i]["title"],
                    "creator": itm[i]["dc:creator"][0]["@value"],
                    "publisher": itm[i]["dc:publisher"],
                    "degreeName": itm[i]["ndl:degreeName"],
                    "dissertationNumber": itm[i]["ndl:dissertationNumber"],
                    "date": itm[i]["dc:date"],
                    "link": itm[i]["link"]["@id"]
                });
            }

            table.appendRows(tableaData);
            doneCallback();
        });
    }; 

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "CiNii Disertations"; //The tableau.connectionName variable defines what we want to call the connector data source when it is displayed in Tableau.
            tableau.submit(); //The tableau.submit() function sends the connector object to Tableau for validation.
        });
    });
})();