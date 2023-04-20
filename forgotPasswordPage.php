<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <title>Reset Password</title>
</head>
<body>
    <section class="vh-100 gradisent-custom">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card bg-dark text-white" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">

                            <div class="mb-md-5 mt-md-4 pb-5">

                                <h2 class="fw-bold mb-2 text-uppercase">Reset Password</h2>
                                <p class="text-white-50 mb-5">Enter your account email</p>

                                <form method="post" action="resetPassword.php">

                                    <?php if (isset($_GET['valid'])) { ?>

                                        <p class="error"><?php echo $_GET['valid']; ?></p>

                                    <?php } ?>                                

                                    <div class="form-outline form-white mb-4">
                                        <input type="email" id="typeEmail" class="form-control form-control-lg" required name="email"/>
                                        <label class="form-label" for="typeEmail">Email</label>
                                    </div>

                                    <button class="btn btn-outline-light btn-lg px-5" type="submit">Submit</button>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</body>
</html>