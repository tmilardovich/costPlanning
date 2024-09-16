import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import podaciServer from '../services/podaci';
import PieChart from './PieChart';

import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const StatisticsPage = () => {
    const [podaci, postaviPodatke] = useState({ data: [], dates: [] });
    const [selectedDate, setSelectedDate] = useState('');
    const [chartData, setChartData] = useState({ lista1: [], lista2: [] });

    useEffect(() => {
        const prijavljeni = window.localStorage.getItem('prijavljeniKorisnik');
        if (prijavljeni) {
            const korisnik = JSON.parse(prijavljeni);
            //setUser(korisnik)
            podaciServer.postaviToken(korisnik.token);
        }
    }, []);

    useEffect(() => {
        console.log('Effect');
        podaciServer.axiosGet().then((response) => {
            var a = response.data.filter((r) => r.type !== 'special');
            var listaRarlicitihDatuma = [];
            a.forEach((element) => {
                if (listaRarlicitihDatuma.indexOf(element.date) === -1) {
                    listaRarlicitihDatuma.push(element.date);
                }
            });
            postaviPodatke((podaci) => ({
                ...podaci,
                data: a,
                dates: listaRarlicitihDatuma,
            }));
        });
    }, []);

    const methodForSetDate = (e) => {
        setSelectedDate(e.target.value);
    };

    const changeForm = (e) => {
        e.preventDefault();

        console.log(selectedDate);

        var lista = [];
        var listaVrijednosti = [];

        podaci.data.forEach((p) => {
            if (p.date === selectedDate) {
                if (lista.indexOf(p.category) === -1) {
                    lista.push(p.category);
                    listaVrijednosti.push(0);
                }
            }
        });

        podaci.data.forEach((p) => {
            if (p.date === selectedDate) {
                var index = lista.indexOf(p.category);
                listaVrijednosti[index] = listaVrijednosti[index] + p.value;
            }
        });

        setChartData((chartData) => ({
            ...chartData,
            lista1: lista,
            lista2: listaVrijednosti,
        }));
    };

    const myStyle = {
        borderRadius: 5,
        background: '#484848',
        padding: 20,
        color: 'white',
    };
    if (podaci.data !== undefined || podaci.dates !== undefined) {
        return (
            <div className="container">
                <h2>Chart</h2>

                <div style={myStyle}>
                    <Form onSubmit={changeForm}>
                        <Row>
                            <Col>
                                <Form.Control
                                    as="select"
                                    onChange={methodForSetDate}
                                    value={selectedDate}
                                >
                                    <option key={0}>Select...</option>
                                    {podaci.dates.map((p) => (
                                        <option key={p}>{p}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                            <Col>
                                <Button type="submit" variant="outline-info" block>
                                    Visualize
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <br></br>
                <PieChart
                    lista={chartData.lista1}
                    listaVrijednosti={chartData.lista2}
                    selectedDate={selectedDate}
                ></PieChart>
            </div>
        );
    } else {
        return null;
    }
};

export default StatisticsPage;
