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
    //TODO make admin redirecton
    if($valid){

        $_SESSION['logged_in'] = true;

        if($username == "admin") {
            header("Location: adminChartPage.php");
        }
        else {
            header("Location: calendar.html");
        }
    }else{
        header("Location: loginPage.php?valid=WrongCredentials");
    }

?>