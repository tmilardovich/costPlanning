import React, { useEffect } from "react";
import Chart from "chart.js";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const PieChart = (props) => {
    useEffect(() => {

        function getRandomColor() {
            var letters = 'BCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * letters.length)];
            }
            return color;
        }
        var listaBoja = [];
        var brojPodataka = props.lista.length;
        for (let index = 0; index < brojPodataka; index++) {
            listaBoja.push(getRandomColor())
        }

        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: props.listaVrijednosti,
                    backgroundColor: listaBoja,
                    label: 'Dataset 1'
                }],
                labels: props.lista
            },
            options: {
                //responsive: true

                animation: {
                    duration: 0
                },
                events: ['click']
            }
        };

        var ctx = document.getElementById('chart-area').getContext('2d');
        new Chart(ctx, config);

    });

    return (

        <Container>
            <Row>
                <Col></Col>
                <Col xs={6}>
                    <canvas id="chart-area" width="100" height="100" />
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
}

export default PieChart