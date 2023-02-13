$(document).ready(function(){
    updateContacts();
});

function createContact(){

    const phone = parseInt(document.getElementById('phone').value);
    const name = document.getElementById('name').value;
    document.getElementById('phone').value="";
    document.getElementById('name').value="";
    var email = "";
    if(document.getElementById('email').value){
        email = document.getElementById('email').value;
        document.getElementById('email').value="";
    }

    $.ajax({
        method: 'GET',
        url: `http://myserver.localhost:8080/newcontact?phone=${phone}&name=${name}&email=${email}`,
        accept: 'text/plain',
        success: function(data){
            if(data !== "" && !data.includes('Contact already assigned') && !data.includes('bad')){
                updateContacts();
            }else{
                alert(data)
            }
            
        },
        error: function(err){
            alert('Something went wrong');
        }
    });
}

function newContact(){
    document.getElementById('popup').style.display='inline-block';
    document.getElementById('newcontact').style.display='inline-block';
    document.getElementById('right-header').style.display='none';
    document.getElementById('left-header').style.display='none';
    document.getElementById('bEdit').disabled=true;
}
function hideCreateContact(){
    document.getElementById('popup').style.display='none';
    document.getElementById('newcontact').style.display='none';
    document.getElementById('right-header').style.display='inline-block';
    document.getElementById('left-header').style.display='inline-block';
    document.getElementsByName('bEdit').disabled=false;
}

function updateContacts(){
    $.ajax({
        method:'GET',
        url: 'http://myserver.localhost:8080/contacts',
        accept: 'plain/text',
        success: function(data){
            if(data != null){
                var aux = data.split('Object');
                document.getElementById('contacts').innerHTML="";
                var h = 0;
                for(var i = 0;i<data.length;i++){
                    h+=35;
                    document.getElementById('contacts').innerHTML+='<div id="contact-item" class="contact-item">'
                    +'<div id="delete-contact"><button id="'+JSON.parse(aux[i+1])['Phone_Number']+'" class="bDel" onclick="javascript:deleteContact(this.id)"></button></div>'
                    +'<div id="name-contact'+JSON.parse(aux[i+1])['Phone_Number']+'">'+JSON.parse(aux[i+1])['Name']+'</div>'
                    +'<div id="phone-contact'+JSON.parse(aux[i+1])['Phone_Number']+'">'+JSON.parse(aux[i+1])['Phone_Number']+'</div>'
                    +'<div id="email-contact'+JSON.parse(aux[i+1])['Phone_Number']+'">'+JSON.parse(aux[i+1])['Email']+'</div>'
                    +'<div id="favourites-contact"><button class="bFav" id="'+JSON.parse(aux[i+1])['Phone_Number']+'" onclick="javascript:createFavourite(this.id)"></button></div>'
                    +'<div id="edit-contact" class="edit-contact"><button name="bEdit" class="bEdit" id="'+JSON.parse(aux[i+1])['Phone_Number']+'" onclick="javascript:showEditContact(this.id)"></button></div>'
                    +'</div><hr>';
                }
                document.getElementById('popup').style.height=h.toString()+"px";
            } else{
                alert('No data');
            }
        }
    });
}

function showEditContact(id){
    document.getElementById('popup').style.display='inline-block';
    document.getElementById('newcontact').style.display="none";
    document.getElementById('editcontact').style.display="inline-block";
    document.getElementById('bCreateContact').disabled=true;
    document.getElementById('bCreateContact').style.display="inline-block";
    document.getElementById('edphone').value=id.toString();
    document.getElementById('previous').value=id.toString();
    document.getElementById('edname').value=document.getElementById('name-contact'+id.toString()).innerHTML;
    document.getElementById('previous').value+=';'+document.getElementById('name-contact'+id.toString()).innerHTML.toString();
    document.getElementById('edemail').value=document.getElementById('email-contact'+id.toString()).innerHTML;
    document.getElementById('previous').value+=';'+document.getElementById('email-contact'+id.toString()).innerHTML.toString();
}

function editContact(){
    const phone = parseInt(document.getElementById('edphone').value);
    const name = document.getElementById('edname').value;
    var email = "";
    if(document.getElementById('edemail').value){
        email = document.getElementById('edemail').value;
        document.getElementById('email').value="";
    }
    const prevp = parseInt(document.getElementById('previous').value.split(';')[0]);
    const prevn = document.getElementById('previous').value.split(';')[1];
    const preve = document.getElementById('previous').value.split(';')[2];
    console.log(prevp+';'+prevn+';'+preve);
    console.log(phone+';'+name+';'+email);
    if(!(phone===prevp)||!(name===prevn)||!(email===preve)){
        $.ajax({
            method:'GET',
            url: `http://myserver.localhost:8080/editcontact?phone=${phone}&name=${name}&email=${email}&prev=${prevp}`,
            accept: 'plain/text',
            success: function(data){
                if(data === 'ok'){
                    hideEditContact();
                    updateFavourites();
                    updateContacts();
                    alert('Changes made successfully');
                } else{
                    alert(data);
                }
            },
            error: function(err){
                alert('Something went wrong editing contact');
            }
        });
    } else{
        alert('Data is the same as previous');
    }
}

function hideEditContact(){
    document.getElementById('popup').style.display='none';
    document.getElementById('editcontact').style.display="none";
    document.getElementById('bCreateContact').disabled=false;
    document.getElementById('right-header').style.display="inline-block";
    document.getElementById('left-header').style.display="inline-block";
}

function createFavourite(id){
    $.ajax({
        method:'GET',
        url: `http://myserver.localhost:8080/favourite?id=${id}`,
        accept: 'plain/text',
        success: function(data){
            if(data != 'Favourite already assigned'){
                updateFavourites();
            } else{
                alert(data);
            }
        }
    });
}

function updateFavourites(){
    $.ajax({
        method:'GET',
        url: 'http://myserver.localhost:8080/favourites',
        accept: 'plain/text',
        success: function(data){
            if(data != null){
                var aux = data.split('Object');
                document.getElementById('favourites').innerHTML="";
                for(var i = 0;i<data.length;i++){
                    document.getElementById('favourites').innerHTML+='<div id="favourite-item" class="favourite-item">'
                    +'<div id="name-favourite">'+JSON.parse(aux[i+1])['Name']+'</div>'
                    +'<div id="phone-favourite">'+JSON.parse(aux[i+1])['Phone_Number']+'</div>'
                    +'<div id="email-favourite">'+JSON.parse(aux[i+1])['Email']+'</div>'
                    +'<div class="delete-favourite"><button id="'+JSON.parse(aux[i+1])['Phone_Number']+'" class="bDelF" onclick="javascript:deleteFavourite(this.id)"></button></div>'
                    +'</div><hr class="favline">';
                }
            } else{
                alert('No data');
            }
        }
    });
}

function showFavourites(){
    updateFavourites();
    document.getElementById('contacts').style.display="none";
    document.getElementById('editcontact').style.display="none";
    document.getElementById('favourites').style.display="inline-block";
    document.getElementById('middle-header-left').style.backgroundColor ="#f3f3f3";
    document.getElementById('middle-header-right').style.backgroundColor ="#d4d4d4";
}

function showContacts(){
    updateContacts();
    document.getElementById('middle-header-left').style.backgroundColor ="#d4d4d4";
    document.getElementById('middle-header-right').style.backgroundColor ="#f3f3f3";
    document.getElementById('contacts').style.display="inline-block";
    document.getElementById('favourites').style.display="none";
}


function deleteContact(id) {
    $.ajax({
        method: 'GET',
        url: `http://myserver.localhost:8080/deletecontact?id=${id}`,
        accept: 'text/plain',
        success: function(data){
            if(data !== "" && !data.includes('Could not delete the contact')){
                updateContacts();
                updateFavourites();
                alert(data);
            }else{
                alert('Could not delete the favourite, try again');
            }
            
        }
    });
}

function deleteFavourite(id) {
    $.ajax({
        method: 'GET',
        url: `http://myserver.localhost:8080/deletefavourite?id=${id}`,
        accept: 'text/plain',
        success: function(data){
            if(data !== "" && !data.includes('Could not delete the favourite')){
                updateContacts();
                updateFavourites();
            }else{
                alert('Could not delete the favourite, try again');
            }
            
        }
    });
}

function hidePopup(){
    hideCreateContact();
    hideEditContact();
}