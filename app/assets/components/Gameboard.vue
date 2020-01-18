<template>
    <section class="game">
        <div class="align-content-center">
            <svg class="svg" width="650" height="650" viewBox="0 0 650 650" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <svg id="empty" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" fill="white"/>
                    </svg>
                </defs>
                <defs>
                    <svg id="white" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="1.5" width="37" height="37" fill="#5CBBB7" stroke="black" stroke-width="3"/>
                        <line x1="0.353553" y1="0.646447" x2="39.3536" y2="39.6464" stroke="black"/>
                        <line x1="39.3536" y1="0.353553" x2="0.353552" y2="39.3536" stroke="black"/>
                    </svg>
                </defs>
                <defs>
                    <svg id="black" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="1.5" width="37" height="37" fill="#FFDE63" stroke="black" stroke-width="3"/>
                        <line x1="0.353553" y1="0.646447" x2="39.3536" y2="39.6464" stroke="black"/>
                        <line x1="39.3536" y1="0.353553" x2="0.353552" y2="39.3536" stroke="black"/>
                    </svg>
                </defs>
                <rect width="650" height="650" fill="#EB5B38"/>
                <rect x="30" y="30" width="292" height="292" fill="black"/>
                <rect x="330" y="330" width="292" height="292" fill="black"/>
                <rect x="30" y="331" width="292" height="292" fill="black"/>
                <rect x="330" y="30" width="292" height="292" fill="black"/>
                <rect x="128" y="128" width="396" height="396" fill="black"/>
                <rect x="128" y="128" width="194" height="194" fill="#5CBBB7"/>
                <rect x="330" y="330" width="194" height="194" fill="#5CBBB7"/>
                <rect x="330" y="128" width="194" height="194" fill="#FFDE63"/>
                <rect x="128" y="330" width="194" height="194" fill="#FFDE63"/>
                <rect x="227" y="223" width="200" height="200" fill="black"/>
                <template v-for="field in gameboard">
                    <field :id="field.id" :x="field.x" :y="field.y" :status="field.status"></field>
                </template>
                <path d="M258.605 315.938L263.059 329.859L267.512 315.938H270.277V333H268.133V326.355L268.332 319.699L263.867 333H262.227L257.785 319.746L257.984 326.355V333H255.84V315.938H258.605ZM296.152 315.938V328.066C296.137 329.684 295.668 330.949 294.746 331.863C293.824 332.777 292.539 333.234 290.891 333.234C289.203 333.234 287.914 332.789 287.023 331.898C286.133 331 285.68 329.723 285.664 328.066V315.938H287.797V327.984C287.797 329.133 288.039 329.992 288.523 330.562C289.016 331.125 289.805 331.406 290.891 331.406C291.984 331.406 292.773 331.125 293.258 330.562C293.75 329.992 293.996 329.133 293.996 327.984V315.938H296.152ZM319.637 325.113H313.602V331.16H320.633V333H311.457V315.938H320.516V317.789H313.602V323.273H319.637V325.113ZM346.555 333H344.398V325.113H337.531V333H335.387V315.938H337.531V323.273H344.398V315.938H346.555V333ZM364.426 331.16H371.117V333H362.27V315.938H364.426V331.16ZM393.863 325.113H387.828V331.16H394.859V333H385.684V315.938H394.742V317.789H387.828V323.273H393.863V325.113Z" fill="white"/>
            </svg>
        </div>
    </section>
</template>

<script>
    import Field from "./Field";
    export default {
        props: {
            gameboard: {
                type: Array
            },
            firstClick: true,
            clickOne: 0
        },
        components: {
            Field
        },
        name: "Gameboard"
    }
</script>

<style scoped>

</style>