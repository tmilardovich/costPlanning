import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

const NewCategory = (props) => {

    const [selectedType, setSelectedType] = useState("expediture")
    const [inputElement, setInputElement] = useState("")

    const methodForSetType = (e) => {
        setSelectedType(e.target.value)
    }

    const methodForInput = (e) => {
        setInputElement(e.target.value)
    }

    const newCategory = (e) => {
        e.preventDefault()

        const obj = {
            type: selectedType,
            category: inputElement
        }

        props.dodavanjeKategorije(obj)
        setSelectedType("expediture")
        setInputElement("")
        window.location.reload()
    }

    const myStyle = {
        borderRadius: 5,
        background: '#484848',
        padding: 20,
        color: "white"
    }
    return (
        <>
            <div style={myStyle}>
                <h5>New Category</h5>
                <Form onSubmit={newCategory}>
                    <Form.Row>
                        <Col xs={7}>
                            <Form.Control placeholder="Enter new category" value={inputElement} onChange={methodForInput} />
                        </Col>
                        <Col>
                            <Form.Control as="select" onChange={methodForSetType} value={selectedType}>
                                <option>expediture</option>
                                <option>income</option>
                            </Form.Control>
                        </Col>
                        <Col>
                            <Button variant="outline-info" block type="submit">Add</Button>
                        </Col>
                    </Form.Row>
                </Form>

            </div>
            <br></br>
        </>
    )
}

export default NewCategory