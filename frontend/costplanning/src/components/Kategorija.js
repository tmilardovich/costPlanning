import React from "react"
import Badge from "react-bootstrap/Badge"
import Button from "react-bootstrap/Button"

const Kategorija = (props) => {
    const myStyle = {
        borderRadius: 5,
        background: '#DCDCDC',
        padding: 10,
        color: "black"
    }
    return (
        <>
            <div style={myStyle}>
                <Button variant="outline-danger" onClick={() => props.brisiKategoriju(props.forVariant, props.c)}>Delete</Button>
                <span>  <b>{props.c}</b> <Badge variant={props.forVariant === "income" ? "success" : "danger"}>{props.forVariant}</Badge></span>
            </div>
            <br></br>
        </>
    )
}

export default Kategorija