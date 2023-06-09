<?php

session_start();

$isAdmin = false;

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] === false) {
  header('Location: loginPage.php');
}

if (isset($_SESSION['admin']) && $_SESSION['admin'] === true) {
  $isAdmin = true;
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <title>Gestionale Eventi</title>
  <link href='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.0/fullcalendar.min.css' rel='stylesheet' />
  <link href='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.0/fullcalendar.print.min.css' rel='stylesheet'
    media='print' />
  <link href='https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css' rel='stylesheet' />
  <link href="assets/css/style.css" rel="stylesheet">
  <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.5/index.global.min.js'></script>
  <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.5/index.global.min.js'></script>
  <script src='assets/js/calendar.js'></script>
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>

</head>

<body>

  <header id="header">
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <div class="container">
        <a class="navbar-brand" href="#">Eventure Co.</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#events-section">Events</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#about-section">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#contact-section">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <section id="principal">
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img class="d-block w-100" src="./assets/img/muneeb-syed-4_M8uIfPEZw-unsplash.jpg" alt="First slide">
          <div class="carousel-caption d-none d-md-block">
            <h5>Eventure Co.</h5>
            <p>Experience unforgettable moments with our exciting events!</p>
          </div>
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="./assets/img/austin-neill-hgO1wFPXl3I-unsplash.jpg" alt="Second slide">
          <div class="carousel-caption d-none d-md-block">
            <h5>Eventure Co.</h5>
            <p>Experience unforgettable moments with our exciting events!</p>
          </div>
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="./assets/img/yannis-papanastasopoulos-yWF2LLan-_o-unsplash.jpg"
            alt="Third slide">
          <div class="carousel-caption d-none d-md-block">
            <h5>Eventure Co.</h5>
            <p>Experience unforgettable moments with our exciting events!</p>
          </div>
        </div>
      </div>
      <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </a>
    </div>
  </section>

  <section id="list-section" style="margin-top: 10%; padding-bottom: 30%;">
    <div class="fixedtop container-fluid">
      <div class="row">
        <div class="col-5 offset-md-4">
          <form id="form">
            <input type="text" id="barraDiRicerca" class="me-0 mt-4" style="width: 30vw;" placeholder="Search..."
              name="search">
            <input type="submit" class="ms-0 mt-4" value="cerca">
          </form>
        </div>
        <div class="col-2 offset-md-1" style="padding-left: 0%;">
          <select name="ordinaPer" class="mt-4 me-0" style="height: 30px;" id="orderBy">
            <option value="alfabeto">A-Z</option>
            <option value="alfabetoInverso">Z-A</option>
            <option value="dataCrescente">Data Crescente</option>
            <option value="dataDecrescente">Data Decrescente</option>
            <option value="location">Luogo</option>
          </select>
        </div>
      </div>
    </div>
    <div>
      <div id="box">
      </div>
    </div>
  </section>

  <section id="events-section">
    <div class="container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card">
            <div class="card-body">
              <h1 class="text-center mb-4">Calendario Eventi</h1>
              <div id='calendar'>
                <button id="showAddEventPage" class="btn btn-primary" type="button" data-toggle="modal"
                  data-target="#exampleModal">
                  AddEvent
                </button>
              </div>
              <div id='popup' class='modal'>
                <div class='modal-dialog'>
                  <div class='modal-content'>
                    <div class='modal-header'>
                      <h3 class='modal-title'></h3>
                      <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div class='modal-body'>
                      <p></p>
                      <button type='button' class='btn btn-danger' id='btn-delete-event'>Elimina evento</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              
              <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">Crea un Concerto</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <form id="CreaEvento">
                        <div>
                          <label for="titolo">Titolo</label>
                          <input type="text" id="titolo" name="titolo" required>
                        </div>

                        <div>
                          <label for="luogo">Luogo</label>
                          <input type="text" id="luogo" name="luogo" required>
                        </div>

                        <div>
                          <label for="data-inizio">Inizio del evento</label>
                          <input type="date" id="data-inizio" name="data-inizio" required>
                        </div>

                        <div>
                          <label for="data-fine">Fine del evento</label>
                          <input type="date" id="data-fine" name="data-fine" required>
                        </div>

                      <div class="modal-footer">
                        <button type="button" id="CloseAddEvent" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" id="AddEvent" class="btn btn-primary">Save changes</button>
                      </div>
                      </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  </section>
  <section class="bg-light" id="about-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-12 text-center">
          <h2 class="section-heading text-uppercase">About Us</h2>
          <h3 class="section-subheading text-muted">Lorem ipsum dolor sit amet consectetur.</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.</p>
        </div>
        <div class="col-md-6">
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum.</p>
        </div>
      </div>
    </div>
  </section>
  <section id="contact-section">
      <div class="container">
        <div class="row">
          <div class="col d-flex justify-content-center">
            <div class="box-map">
              <div class="map-responsive">
                <iframe
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA0s1a7phLN0iaD6-UE7m4qP-z21pH0eSc&q=Eiffel+Tower+Paris+France"
                  width="800px" height="400px" frameborder="0" style="border:0" allowfullscreen>
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
      <div class="footer_contact">
        <h4>
          Reach at..
        </h4>
        <div class="contact_link_box">
          <ul class="list-group">
            <div class="list-group-item">
              <img src="./assets/img/image 9.png" alt="email-image">
              <span>
                email@gmail.com
              </span>
            </div>
            <div class="list-group-item">
              <img src="./assets/img/image 10.png" alt="number-image">
              <span>
                +39 123 456 789
              </span>
            </div>
            <div class="list-group-item">
              <img src="./assets/img/image 11.png" alt="position-image">
              <span>
                position
              </span>
            </div>
          </ul>
        </div>
      </div>
      <p class="text-center"> © 2023 All Rights Reserved </p>
    </div>
  </section>

  <div id="varDiv" data-var="<?php echo htmlspecialchars($isAdmin); ?>"></div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous">
    </script>

</body>

</html>