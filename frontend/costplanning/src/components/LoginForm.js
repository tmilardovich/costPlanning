import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import loginServer from "../services/login"

import podaciServer from "../services/podaci"
import RegisterForm from "./RegisterForm"

const LoginForm = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [view, setView] = useState(true)

    const chng = () => {
        setView(!view)
    }

    const userLogin = async (e) => {
        e.preventDefault()
        try {
            const korisnik = await loginServer.prijava({ username: username, pass: password })
            window.localStorage.setItem("prijavljeniKorisnik", JSON.stringify(korisnik))
            podaciServer.postaviToken(korisnik.token)
            setUsername("")
            setPassword("")
            props.postaviUser(korisnik)
        }
        catch (error) {
            console.error(error)
            alert("neispravni podaci")
        }
    }
    if (view === true) {
        return (
            <div className="container">
                <br></br>
                <h3>Log in to your account</h3>
                <br></br>
                <Form onSubmit={userLogin}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control type="text" value={username} name="Username" onChange={(e) => setUsername(e.target.value)} />
                        <Form.Text className="text-muted">We'll never share your username with anyone else.</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" value={password} name="Password" onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Button variant="primary" type="submit">Submit</Button>
                </Form>

                <br></br>
                <span>Don't have an account?&nbsp;</span>
                <Button variant="outline-primary" size="sm" onClick={chng}>Create one</Button>

            </div>
        )
    }
    else {
        return (
            <div className="container">
                <RegisterForm></RegisterForm>
                <br></br>
                <span>Changed your mind?&nbsp;</span>
                <Button variant="outline-primary" size="sm" onClick={chng}>Back to log in</Button>
            </div>
        )
    }
};

export default LoginForm