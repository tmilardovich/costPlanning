import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import LoginForm from "./LoginForm"

test("", () => {
    const component = render(<LoginForm></LoginForm>)
    const btn = component.getByText("Create one")

    fireEvent.click(btn)
    //component.debug()
    expect(component.getByText("Back to log in")).toBeDefined()
})