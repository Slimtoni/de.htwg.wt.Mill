<template>

    <footer class="footer">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-6 mt-md-0 mt-3">
                    <h5>About</h5>
                    <p>Developed by Anton Hummel &amp; Matthias Asche at the HTWG Konstanz for Web Technologies</p>
                </div>
                <hr class="clearfix w-100 d-md-none pb-3">
                <div class="col-md-6 mb-md-0 mb-3">
                    <h5> Contact us</h5>
                    <p>You can contact us via our HTWG Email</p>
                </div>
            </div>
        </div>
    </footer>

</template>


<script>
    export default {
        name: "MillFooter"
    }

</script>

<style>
    .footer {
        clear: both;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 100px;
        background-color: #e05435;
        color: white;
        text-align: center;
        margin-top: 50px;
    }

    h5 {
        margin-top: 10px;
        text-transform: uppercase;
        font-weight: bold;

    }

    .container-fluid {
        text-align: left;
    }


    @media (max-width: 800px) {
        .footer {

        }

    }

    @media (max-width: 766px) {
        .footer {
            height: 280px;

        }

    }



</style>