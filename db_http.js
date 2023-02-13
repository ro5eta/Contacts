const mysql = require('mysql');
const http = require('node:http');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'MyDataBase'
});

connection.connect(function(err){
    if (err) throw err;
    console.log('Database connection: OK');
});

const hostname = 'myserver.localhost';
const port = 8080;

var server = new http.createServer(function(req,res){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Content-Type', 'text/plain');
    if(req.url.includes('/newcontact')&&req.url.includes('&name=')&&req.url.includes('?phone=')){
        var params = '{"phone":"' + req.url.split('?')[1].split('&')[0].split('=')[1]
        +'","name":"' + req.url.split('?')[1].split('&')[1].split('=')[1]
        +'","email":"';
        if(req.url.split('?')[1].split('&')[2]) {
            params += req.url.split('?')[1].split('&')[2].split('=')[1];
        }
        params += '"}';
        newContactDB(JSON.parse(params),res);
    }else if(req.url.includes('/contacts')){
        showContacts(res);
    }else if(req.url.includes('/favourites')){
        showFavourites(res);
    }else if(req.url.includes('/favourite?id=')){
        var params = '{"phone":"' + req.url.split('=')[1] +'"}';
        newFavourite(params,res);
    }else if(req.url.includes('/deletecontact?id=')){
        var params = '{"phone":"' + req.url.split('=')[1] +'"}';
        deleteContact(params,res);
    }else if(req.url.includes('/deletefavourite?id=')){
        var params = '{"phone":"' + req.url.split('=')[1] +'"}';
        deleteFavourite(params,res);
    }else if(req.url.includes('/edit?id=')){
        var params = '{"phone":"' + req.url.split('=')[1] +'"}';
        editContact(params,res);
    }else if(req.url.includes('/editcontact')&&req.url.includes('&name=')&&req.url.includes('?phone=')&&req.url.includes('&prev=')){
        var params = '{"phone":"' + req.url.split('?')[1].split('&')[0].split('=')[1]
        +'","name":"' + req.url.split('?')[1].split('&')[1].split('=')[1]
        +'","email":"';
        if(req.url.split('?')[1].split('&')[2]) {
            params += req.url.split('?')[1].split('&')[2].split('=')[1];
        }
        params += '"}';
        const prev = parseInt(req.url.split('?')[1].split('&')[3].split('=')[1]);
        editContactDB(JSON.parse(params),res,prev);
    } else{
        res.write('bad query');
        res.end();
    }
});

server.listen(port,hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});


function newContactDB(contact,res){
    let resp = "";
    var sql = "INSERT INTO Contacts (Phone_Number,Name,Email) VALUES (?)";
    var values = [parseInt(contact['phone']),contact['name'],contact['email']];
    connection.query(
        sql,
        [values],
        function (error, results, fields) {
            if (!error) {
                console.log('New contact added to MyDataBase');
                resp = JSON.stringify(contact);
                res.write('ok');
                res.end();
            } else {
                if(error.errno==1062){
                    console.log('Duplicate entry for key "PRIMARY"')
                    res.write('Contact already assigned');
                    res.end();
                }
            }
    });
}

function showContacts(res){
    let result = "";
    let sql = "SELECT * FROM Contacts ORDER BY Name";
    connection.query(
        sql,
        function (error, results, fields) {
            if (!error) {
                for(var i=0;i<results.length;i++){
                    result+='Object'+JSON.stringify(results[i]);
                }
                res.write(result);
                res.end();
            } else {
                console.log(error)
                res.write('');
                res.end();
            }
    });
}

function showFavourites(res){
    let result = "";
    let sql = "SELECT * FROM Contacts WHERE (SELECT * FROM Favourites WHERE Contacts.Phone_Number=Favourites.Phone_Number) ORDER BY Name";
    connection.query(
        sql,
        function (error, results, fields) {
            if (!error) {
                for(var i=0;i<results.length;i++){
                    result+='Object'+JSON.stringify(results[i]);
                }
                res.write(result);
                res.end();
            } else {
                console.log(error)
                res.write('');
                res.end();
            }
    });
}

function newFavourite(contact,res){
    var sql = "INSERT INTO Favourites (Phone_Number) VALUES (?)";
    var values = [parseInt(JSON.parse(contact)['phone'])];
    connection.query(
        sql,
        [values],
        function (error, results, fields) {
            if (!error) {
                console.log('New favourite added to MyDataBase');
                res.write('ok');
                res.end();
            } else {
                if(error.errno==1062){
                    console.log('Duplicate entry for key "PRIMARY"')
                    res.write('Favourite already assigned');
                    res.end();
                }
            }
    });
}

function deleteContact(contact,res){
    var sql1 = `DELETE FROM Favourites WHERE Phone_Number=(${parseInt(JSON.parse(contact)['phone'])})`;
    var sql2 = `DELETE FROM Contacts WHERE Phone_Number=(${parseInt(JSON.parse(contact)['phone'])})`;
    connection.beginTransaction(function(err){
        if(err){console.log(err);}
        connection.query(
        sql1,
        function (error, results, fields) {
            if (!error) {
                console.log('Contact deleted from Favourites Table');
                connection.query(
                sql2,
                function (error, results, fields) {
                        if (!error) {
                        connection.commit(function(err){
                            if (!error) {
                                console.log('Contact deleted from Contacts Table');
                                res.write('Contact successfully deleted');
                                res.end();
                            }else{
                                console.log(error);
                            }
                        });
                    } else {
                        console.log(error);
                        if(error.errno==1062){
                            console.log('Key not found');
                            res.write('Could not delete the contact');
                            res.end();
                        }
                    }
                });
            } else {
                console.log(error);
                if(error.errno==1062){
                    console.log('Key not found');
                    res.write('Could not delete the contact');
                    res.end();
                }
            }
    });
    });
}

function deleteFavourite(contact,res){
    var sql1 = `DELETE FROM Favourites WHERE Phone_Number=(${parseInt(JSON.parse(contact)['phone'])})`;
    connection.beginTransaction(function(err){
        if(err){console.log(err);}
        connection.query(
        sql1,
        function (error, results, fields) {
            if (!error) {
                connection.commit(function(err){
                    if (!error) {
                        console.log('Contact deleted from Favourites Table');
                        res.write('Favourite successfully deleted');
                        res.end();
                    }else{
                        console.log(error);
                    }
                });
            } else {
                console.log(error);
                if(error.errno==1062){
                    console.log('Key not found');
                    res.write('Could not delete the favourite');
                    res.end();
                }
            }
    });
    });
}

function editContactDB(contact,res,prev){
    var sql1 = `UPDATE Favourites SET Phone_Number=(${parseInt(contact['phone'])}) WHERE Phone_Number=(${prev})`;
    var sql2 = `UPDATE Contacts SET Phone_Number=${parseInt(contact['phone'])},Name='${contact['name']}',Email='${contact['email']}' WHERE Phone_Number=(${prev})`;
    connection.beginTransaction(function(err){
        if(err){console.log(err);}
        connection.query(
        sql1,
        function (error, results, fields) {
            if (!error) {
                console.log('Contact updated from Favourites Table');
                connection.query(
                sql2,
                function (error, results, fields) {
                    if (!error) {
                        connection.commit(function(err){
                            if (!error) {
                                console.log('Contact updated from Contacts Table');
                                res.write('ok');
                                res.end();
                            }else{
                                console.log(error);
                            }
                        });
                    } else {
                        console.log(error);
                        if(error.errno==1062){
                            console.log('Key not found');
                            res.write('Could not update the contact, Phone already asigned');
                            res.end();
                        }
                    }
                });
            } else {
                console.log(error);
                if(error.errno==1062){
                    console.log('Key not found');
                    res.write('Phone already asigned');
                    res.end();
                }
            }
    });
    });
}
