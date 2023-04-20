<?php
    session_start();
    $_SESSION['valid'] = false;

    $username =  $_POST['username'];
    $password = $_POST['password'];

    $data = file_get_contents("metadata/login.json"); 
    $jsonArray = json_decode($data, true);
    
    $valid = false;

    foreach($jsonArray as $value){
        if($value['username'] == $username && 
            password_verify($password, $value['password'])){
            $valid = true;
        }
    }
    
    $_SESSION['valid'] = $valid;
    
    if($valid){

        $_SESSION['logged_in'] = true;
        
        $_SESSION['admin'] = false;

        if($username === "admin") {
            $_SESSION['admin'] = true;
            header("Location: calendar.php");
        }
        else {
            header("Location: calendar.php");
        }
    }else{
        header("Location: loginPage.php?valid=WrongCredentials");
    }

?>