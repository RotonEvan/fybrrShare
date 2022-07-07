function copyToClipboard(element) {
    // var $temp = $("");
    // $(".roomID").append($temp);
    // $temp.val($(element).text()).select();
    // document.execCommand("copy");
    // $temp.remove();
}

window.onload = function () {
    const roomID = location.pathname.substring(location.pathname.length - 4);
    console.log(roomID);
    window.roomID = roomID;
    document.querySelector('.roomID').innerText += roomID;
}

// const add = document.querySelector(".add");
// add.addEventListener("click", () => {

// })

Highcharts.chart('peers', {
    chart: {
        type: 'networkgraph',
        // color: 'rgba(255, 255, 255, 0)'
    },
    title: {
        text: 'Peer graph',
        color: '#ccc'
    },
    plotOptions: {
        networkgraph: {
            layoutAlgorithm: {
                enableSimulation: true
            }
        }
    },

    series: [{
        dataLabels: {
            enabled: true,
            // linkTextPath: {
            //     attributes: {
            //         dy: 12
            //     }
            // },
            linkFormat: '',
            textPath: {
                enabled: true,
                attributes: {
                    dy: 14,
                    startOffset: '45%',
                    textLength: 80
                }
            },
            format: 'Node: {point.name}'
        },
        marker: {
            radius: 35
        },
        data: [{
            from: 'n1',
            to: 'n2'
        }, {
            from: 'n2',
            to: 'n3'
        }, {
            from: 'n3',
            to: 'n4'
        }, {
            from: 'n4',
            to: 'n5'
        }, {
            from: 'n5',
            to: 'n1'
        }]
    }]
});