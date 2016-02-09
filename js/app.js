function dataService(dataType){
    
    var thePromise = new Promise(function(resolve, reject) {
        var Employees = Parse.Object.extend('Employees');
        var query = new Parse.Query(Employees);
        
        if (dataType == 'ALL') {
            query.find({
                success: function(results) {
                    resolve(results);
            
                
                },
                error: function(error) {
                    reject(error);
                    alert('Data Error :' + error);
                }
            });
        } else {
            query.get( dataType, {
                success: function(results) {
                    resolve(results);
            
                
                },
                error: function(object,error) {
                    reject(error);
                    alert('Data Error :' + error);
                }
            });
            
            
        }
        
        
        
    });
    
    return thePromise;
    
}



function editEmployee(id){
    dataService(id).then(function(result){
           
            
           navigatePages('#edit', result);
    });
    
}

function updateEmployee(id){
    var employeeFirstName = $('#employeeFirstName').val();
    var employeeLastName = $('#employeeLastName').val();
    var employeeTitle = $('#employeeTitle').val();
    var employeeSocial = $('#employeeSocial').val();
    
     dataService(id).then(function(result){
           
        result.set('employeeFirstName', employeeFirstName);
        result.set('employeeLastName', employeeLastName);
        result.set('employeeTitle', employeeTitle);
        result.set('employeeSocial', employeeSocial);
        
        result.save();
        
        location.reload();
        
     });

}


function deleteEmployee(id){
  
    dataService(id).then(function(result){
        result.destroy({
            success: function(result) {
                
                alert('Delete Employee ID : ' + result.id);  
                location.reload();
            
            },
            error: function(result, error) {
                alert('Delete Failed, error: ' + error);      
            }
        });
    });       
}











function registerUser () {

    var theUser = $('#username').val();
    var pass1 = $('#password').val();
    var pass2 = $('#password2').val();
    
    if (pass1 !== pass2) {
        alert('Passwords do not match, try again');
    } else {

        var newUser = new Parse.User();
        
        newUser.set('username', theUser);
        newUser.set('password', pass1);
        newUser.set('email', theUser);
        
        newUser.signUp(null, {
            success: function(user) {
                alert('Registerd user :' + theUser);
                navigatePages('#login');
            },
            error: function(user, error) {
                alert('Error: ' + error.code + ' ' + error.message);
            }
        });

    }

}

function logOff () {
    Parse.User.logOut();
    alert('Logged out!');
    navigatePages('#login');
}


function logOn () {
	var myUser = $('#username').val(); 
    var myPass = $('#password').val();

    Parse.User.logIn(myUser, myPass, {
        success: function(user) {
            alert('Logging in ' + myUser);
            
            dataService('ALL').then(function(result){
                navigatePages('#home', result);
            });
            
        },
        error: function(user,error) {
            alert('Error: ' + error.code + ' ' + error.message);    
        }
    });
}

function addEmp () {
    
	var employeeFirstName = $('#employeeFirstName').val();
    var employeeLastName = $('#employeeLastName').val();
    var employeeTitle = $('#employeeTitle').val();
    var employeeSocial = $('#employeeSocial').val();
    var employeePhoto = $('#employeePhoto')[0];
    
    var tmpPic = employeePhoto.files[0];
    var tmpName = 'employeePhoto.jpg';
    
    var myImage = new Parse.File(tmpName, tmpPic);
    
    myImage.save().then(function() {
        console.log('Saved image for employee ' + employeeFirstName + '' + employeeLastName);
    }, 
    function(error) {    
        alert('could not save image beacuse of ' + error);
    });
    
    var NewEmp = Parse.Object.extend('Employees');
    var newEmployee = new NewEmp();
    
    newEmployee.set('employeeFirstName', employeeFirstName);
    newEmployee.set('employeeLastName', employeeLastName);
    newEmployee.set('employeeTitle', employeeTitle);
    newEmployee.set('employeeSocial', employeeSocial);
    newEmployee.set('employeePhoto', myImage);
    
     newEmployee.save(null, {
        success: function(obj) {
            alert('New Employee created with objectId: ' + obj.id);
            location.reload();
        },
        error: function(obj, error) {
            alert('Failed to create new Employee, with error code: ' + error.message);
            
        }
    });
    
    
}












function navigatePages (temp, obj) {
   
    var theView;
    var template = $(temp).html(); 
    
    if (obj){
        theView = Mustache.render(template, obj);
    } else {
        theView = Mustache.render(template);
    }
    
    $('.template-view').html(theView); 
    
    if (temp == '#login') {
        $('#loginButton').click(logOn);
        $('#signUpButton').click(function() {
            navigatePages('#sign-up');
        });
    }
    
    if (temp == '#sign-up') { 
        $('#registerButton').click(registerUser);   
        $('#cancelButton').click(function() {
            navigatePages('#login');
        });
    } 
    
    if (temp == '#home') {
        $('#logout').click(logOff);
        $('#addNew').click(function() {
            navigatePages('#add');
        });
    }
    
    if (temp == '#add') {
        $('#addEmployee').click(addEmp);
        $('#cancelButton').click(function() {
            navigatePages('#home');
        });
    }
    
    if (temp == '#edit') {
        $('#cancelButton').click(function() {
            location.reload();
        });
    }

    
}



window.onload = function() {
  
    init();

    
};

function init () {
    
    Parse.initialize('myAppId');
    Parse.serverURL = 'heroku server URL goes here';
    
    var userLoggedIn = Parse.User.current();
    
    
    if (userLoggedIn){
        
        dataService('ALL').then(function(result){
                navigatePages('#home', result);
        });  
    
    } else {
      
        navigatePages('#login');
        
    }
}