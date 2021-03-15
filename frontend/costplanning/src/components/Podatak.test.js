import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import Podatak from "./Podatak"

test("renderira se podatak", () => {
    const podatak = {
        description: "test",
        value: 500,
        category: "wage",
        type: "income",
        id: 1,
        date: "2021-03-03"
    }
    const category = [
        {
            special: {
                income: ["wage", "other"],
                expediture: ["other", "tuition"]
            }
        }
    ]

    const komponenta = render(<Podatak podatak={podatak} categoryAll={category} ></Podatak>)

    expect(komponenta.container).toHaveTextContent("test")
})

test("klik", () => {
    const podatak = {
        description: "test",
        value: 500,
        category: "wage",
        type: "income",
        id: 1,
        date: "2021-03-03"
    }
    const category = [
        {
            special: {
                income: ["wage", "other"],
                expediture: ["other", "tuition"]
            }
        }
    ]
    const testHandler = jest.fn()
    const component = render(
        <Podatak podatak={podatak} categoryAll={category} updateData={testHandler}></Podatak>
    )

    const btn = component.getByText("Update")
    fireEvent.click(btn)

    expect(testHandler.mock.calls).toHaveLength(1)
})