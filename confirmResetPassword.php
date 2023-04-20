<?php
    session_start();

    $password = $_POST['password1'];
    $password2 = $_POST['password2'];

    $token = $_SESSION['token'];
    $_SESSION['token'] = null;

    $data = file_get_contents("metadata/login.json"); 
    $jsonArray = json_decode($data, true);

    $valid = true;

    if($password != $password2){
        $valid = false;
        $errorMessage .= " password do not match";
    }

    $_SESSION['valid'] = $valid;

    if($valid){
        
        $data = file_get_contents("metadata/login.json"); 
        $jsonArray = json_decode($data, true);

        $cnt = 0;
    
        foreach($jsonArray as $value){
            if($value['token'] == $token){
    
                $jsonArray[$cnt]['password'] = $password;
                $jsonArray[$cnt]['token'] = null;
    
                $jsonData = json_encode($jsonArray);
    
                file_put_contents('metadata/login.json', $jsonData);
            }
            $cnt++;
        }

        echo "succsess";
        header("Location: loginPage.php");

    }else{
        header("Location: resetPasswordPage.php?token=".$token."&&valid=password do not match");
    }
?>