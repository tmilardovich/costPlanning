import React, { useState, useEffect } from "react"
import podaciServer from "../services/podaci"
import Spinner from "react-bootstrap/Spinner"
import NewCategory from "./NewCategory"
import Kategorija from "./Kategorija"
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

const SettingsPage = () => {
  const [categoryAll, setCategoryAll] = useState(null)
  const [show, setShow] = useState({ value: false, msg: "" });

  useEffect(() => {
    const prijavljeni = window.localStorage.getItem("prijavljeniKorisnik")
    if (prijavljeni) {
      const korisnik = JSON.parse(prijavljeni)
      //setUser(korisnik)
      podaciServer.postaviToken(korisnik.token)
    }
  }, [])

  const changeShow = () => {
    setShow({ value: false, msg: "" })
  }

  useEffect(() => {
    console.log("EffectSettings")
    podaciServer.axiosGetCategories().then((response) => {
      console.log(response)
      setCategoryAll(response.data[0].special)
    })
  }, [])

  const brisiKategoriju = (tip, kateg) => {
    podaciServer.axiosDeleteCategory(tip, kateg).then((response) => {

      if (tip === "income") {
        const index = categoryAll.income.indexOf(kateg)
        if (index > -1) {

          setCategoryAll(categoryAll => ({
            ...categoryAll,
            income: categoryAll.income.filter(c => c !== kateg)
          }))
        }
      }
      else if (tip === "expediture") {

        const index = categoryAll.expediture.indexOf(kateg)
        if (index > -1) {

          setCategoryAll(categoryAll => ({
            ...categoryAll,
            expediture: categoryAll.expediture.filter(c => (c !== kateg))
          }))
        }
      }
    })
      .catch(err => {
        setShow({ value: true, msg: err.response.data.error })
      })

  }

  const dodavanjeKategorije = (obj) => {
    podaciServer.axiosAddCategory(obj).then((response) => {
      if (obj.type === "income") {
        setCategoryAll(categoryAll => ({
          ...categoryAll,
          income: categoryAll.income.concat(obj.category)
        }))
      }
      else if (obj.type === "expediture") {
        setCategoryAll(categoryAll => ({
          ...categoryAll,
          income: categoryAll.expediture.concat(obj.category)
        }))
      }
    }).catch(err => {
      setShow({ value: true, msg: err.response.data.error })
    })
  }

  if (categoryAll !== null) {
    return (
      <div className="container">
        <h2>Settings</h2>

        {
          show.value === true ? (<MyAlert changeShow={changeShow} msg={show.msg}></MyAlert>) : (null)
        }
        <NewCategory dodavanjeKategorije={dodavanjeKategorije}></NewCategory>
        {
          categoryAll.income.map((c, index) => (<Kategorija key={index} c={c} forVariant="income" brisiKategoriju={brisiKategoriju}></Kategorija>))
        }
        {
          categoryAll.expediture.map((c, index) => (<Kategorija key={index} c={c} forVariant="expediture" brisiKategoriju={brisiKategoriju}></Kategorija>))
        }
      </div>
    );
  }
  else {
    return <Spinner animation="grow" variant="dark" />
  }
};

export default SettingsPage