<template>

    <nav class="navbar navbar-expand-sm navbar-light">
        <a href="/" class="navbar-brand text-dark">NineMensMorris by Anton &amp; Matthias</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <a class="nav-item nav-link " href="/">Home <span class="sr-only">(current)</span></a>
                <a class="nav-item nav-link" href="/rules">Rules</a>
                <a class="nav-item nav-link" href="/loginpage">Logout</a>
            </div>
        </div>
    </nav>

</template>

<script>
    export default {
        name: "Navbar",
    }

</script>

<style>

    .navbar {
        text-align: center;
        background-color: lightgrey;
        border: 2px solid;
        margin-top: 10px;
        margin-bottom: 5px;
        border-radius: 10px;
        margin-left: auto;
        margin-right: auto;
        width: 70%;
    }


    .navbar-light .navbar-nav .nav-link:hover {
        color: #5CBBB7;
    }


    @media (max-width: 800px) {
        .navbar {
            width: 90%;
        }

    }

    @media (max-width: 470px) {
        .navbar {
            width: 90%;
        }
        .navbar-brand{
            font-size: 14px;
        }
    }

    @media (max-width: 390px) {
        .navbar-brand{
            font-size: 12px;
        }

    }


</style>