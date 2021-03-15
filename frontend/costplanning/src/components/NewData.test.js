import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import NewData from "./NewData"

test("ne renderira se komponenta ako se ne posalje props", () => {
    const component = render(<NewData typeForReRenderForm={""}></NewData>)
    const forma = component.container.querySelector("form")
    expect(forma).toBe(null)
})

test("ispravno se renderira", () => {
    const category = [
        {
            special: {
                income: ["wage", "other"],
                expediture: ["other", "tuition"]
            }
        }
    ]

    const component = render(<NewData typeForReRenderForm={"income"} categoryAll={category}></NewData>)
    expect(component.container.querySelector("select")).toBeDefined()
    expect(component.container.querySelector("select")).toHaveTextContent("wage")
    expect(component.container.querySelector("select")).toHaveTextContent("other")
    expect(component.container.querySelector("select")).not.toHaveTextContent("tuition")

})

test("ispravno se renderira 2", () => {
    const category = [
        {
            special: {
                income: ["wage", "other"],
                expediture: ["other", "tuition"]
            }
        }
    ]

    const component = render(<NewData typeForReRenderForm={"expediture"} categoryAll={category}></NewData>)
    expect(component.container.querySelector("select")).toBeDefined()
    expect(component.container.querySelector("select")).toHaveTextContent("other")
    expect(component.container.querySelector("select")).toHaveTextContent("tuition")
    expect(component.container.querySelector("select")).not.toHaveTextContent("wage")
})

test("pojavljuje se alert ako se ne izabere kategorija i poziv f-je ako se izabere", () => {
    const category = [
        {
            special: {
                income: ["wage", "other"],
                expediture: ["other", "tuition"]
            }
        }
    ]

    const funkcijaZaSpremanje = jest.fn()

    const component = render(<NewData typeForReRenderForm={"expediture"} categoryAll={category} noviPodatak={funkcijaZaSpremanje}></NewData>)

    const input1 = component.container.querySelector(".input1")
    const input2 = component.container.querySelector(".input2")

    const forma = component.container.querySelector("form")

    fireEvent.change(input1, {
        target: { value: 100 }
    })

    fireEvent.change(input2, {
        target: { value: "opis" }
    })
    fireEvent.submit(forma)

    expect(funkcijaZaSpremanje.mock.calls).toHaveLength(0)

    expect(component.container.querySelector('[role="alert"]')).toBeDefined()
    const select = component.container.querySelector("select")
    fireEvent.change(select, {
        target: { value: "other" }
    })

    fireEvent.submit(forma)
    expect(funkcijaZaSpremanje.mock.calls).toHaveLength(1)
})

test("alert nestaje nakon gašenja", () => {
    const category = [
        {
            special: {
                income: ["wage", "other"],
                expediture: ["other", "tuition"]
            }
        }
    ]

    const funkcijaZaSpremanje = jest.fn()

    const component = render(<NewData typeForReRenderForm={"expediture"} categoryAll={category} noviPodatak={funkcijaZaSpremanje}></NewData>)
    const forma = component.container.querySelector("form")
    fireEvent.submit(forma)
    expect(component.container.querySelector('[role="alert"]')).toBeDefined()
    const alert = component.container.querySelector('[role="alert"]')
    fireEvent.click(alert)
    expect(component.container.querySelector('[role="alert"]')).toBe(null)
})