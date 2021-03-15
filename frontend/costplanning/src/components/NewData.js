import React, { useState } from "react"
import { Button, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"

const MyAlert = (props) => {

    return (
        <Alert variant="danger" onClick={props.changeShow} dismissible>
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>
                {props.msg}
            </p>
        </Alert>
    )
}

const NewData = (props) => {

    const [unosPodatka, postaviUnos] = useState("")
    const [unosDescription, postaviDescription] = useState("")
    const [categorySelect, mathodForChangeCategory] = useState("")
    const [showAlert, setShowAlert] = useState({ value: false, msg: "" });



    const changeShowAlert = () => {
        setShowAlert({ value: false, msg: "" })
    }

    const promjenaUnosa = (e) => {
        postaviUnos(e.target.value)
    }

    const promjenaDescription = (e) => {
        postaviDescription(e.target.value)
    }

    const changeCategorySelect = (e) => {
        mathodForChangeCategory(e.target.value)
    }

    const noviP = (e) => {
        e.preventDefault()

        if (categorySelect === "" || categorySelect === "Choose...") {
            setShowAlert({ value: true, msg: "You have to shoose category..." })
        }
        else {
            const noviObjekt = {
                //id:
                type: props.typeForReRenderForm,
                category: categorySelect,
                date: new Date().toISOString().substring(0, 10),
                value: unosPodatka,
                description: unosDescription
            }
            props.noviPodatak(noviObjekt)
            postaviUnos("");
            postaviDescription("")
            setShowAlert({ value: false, msg: "" })
            mathodForChangeCategory("")
        }

    }

    if (props.typeForReRenderForm === "income" || props.typeForReRenderForm === "expediture") {

        return (
            <Form onSubmit={noviP} className="formaSubmit">

                <br></br>
                {
                    showAlert.value === true ? (<MyAlert changeShow={changeShowAlert} msg={showAlert.msg}></MyAlert>) : (null)
                }
                <Form.Group as={Row} controlId="formHorizontal1">
                    <Form.Label column sm={2}>Amount:</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="number" placeholder="Enter amount" value={unosPodatka} onChange={promjenaUnosa} className="input1" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontal2">
                    <Form.Label column sm={2}>Category:</Form.Label>
                    <Col sm={10}>
                        <Form.Control as="select" onChange={changeCategorySelect} value={categorySelect} className="select">
                            <option key="default">Choose...</option>
                            {
                                props.typeForReRenderForm === "income"
                                    ? props.categoryAll[0].special.income.map((c) => (<option key={c}>{c}</option>))
                                    : props.categoryAll[0].special.expediture.map((c) => (<option key={c}>{c}</option>))
                            }
                        </Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontal3">
                    <Form.Label column sm={2}>Description:</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="Description..." value={unosDescription} onChange={promjenaDescription} className="input2" />
                    </Col>
                </Form.Group>


                <Button type="submit">Save</Button>
            </Form>
        )
    }
    else return null
}

export default NewData;