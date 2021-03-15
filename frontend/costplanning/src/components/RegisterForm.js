import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import loginServer from "../services/login"
import podaciServer from "../services/podaci"

const RegisterForm = (props) => {
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const changeName = (e) => {
        setName(e.target.value)
    }

    const changeUsername = (e) => {
        setUsername(e.target.value)
    }

    const changePassword = (e) => {
        setPassword(e.target.value)
    }

    const changePassword2 = (e) => {
        setPassword2(e.target.value)
    }

    const register = async (e) => {
        e.preventDefault()
        if (password2 === password) {
            var odg = await loginServer.registracija({ username: username, ime: name, pass: password })
            console.log(odg)
            if (odg.msg === "uspjesno") {
                const korisnik = await loginServer.prijava({ username: username, pass: password })
                window.localStorage.setItem("prijavljeniKorisnik", JSON.stringify(korisnik))
                podaciServer.postaviToken(korisnik.token)
                document.location.reload()
            }
            else {
                console.log("greska")
            }
        }
        else {
            console.log("razlicite lozike")
        }
    }
    return (
        <div>
            <br></br>
            <h3>Create account</h3>
            <br></br>
            <Form onSubmit={register}>

                <Form.Group controlId="formBasicEmail2">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" value={name} onChange={changeName} />
                    <Form.Text className="text-muted">
                        We'll never share your data with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="text" value={username} onChange={changeUsername} />

                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" value={password} onChange={changePassword} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword2">
                    <Form.Label>Type password again to confirm:</Form.Label>
                    <Form.Control type="password" value={password2} onChange={changePassword2} />
                </Form.Group>

                <Button variant="primary" type="submit">Submit</Button>
            </Form>

        </div>
    )
};

export default RegisterForm