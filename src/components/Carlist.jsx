import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-material.css";
import AddCar from "./AddCar";
import EditCar from "./EditCar";
import { getCars } from "../carapi";
import Button from '@mui/material/Button'

export default function Carlist() {
    const [cars, setCars] = useState([]);
    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Brand', field: 'brand', filter: true },
        { headerName: 'Model', field: 'model', filter: true },
        { headerName: 'Color', field: 'color', filter: true },
        { headerName: 'Fuel', field: 'fuel', filter: true },
        { headerName: 'Year', field: 'modelYear', filter: true },
        { headerName: 'Price', field: 'price', filter: true },
        {
            cellRenderer: params => <EditCar data={params.data} updateCar={updateCar}/>,
            width: 120

        },
        {
            cellRenderer: params =>
                <Button size="small" color="error" onClick={() => deleteCar(params.data._links.car.href)}>
                    Delete
                </Button >,
            width: 150
        }
    
    ]);

    useEffect(() => fetchData(), []);

    const fetchData = (setData) => {
        getCars()
            .then(data => setCars(data._embedded.cars))
            .catch(error => console.error('Error fetching the data:', error));
    }

    const deleteCar = (url) => {
        if (window.confirm("Are you sure?")) {
            fetch(url, { method: 'DELETE' })
            .then(response => {
                if (!response.ok)
                    throw new Error("Error in deletion: " + response.statusText);
    
                return response.json();
            })
            .then(() => fetchData(setCars))
            .catch(err => console.error(err))
        }
    }
    
const updateCar = (url, updateCar) => {
    fetch(url, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(updateCar)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error when updating the car");
            return response.json()
        })
        .then(() => fetchData()
        .catch(err => console.log(err)))
    }

    const addCar = (newCar) => {
        fetch(import.meta.env.VITE_API_URL, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(newCar)
        })
            .then(response => {
                if (!response.ok)
                    throw new Error("Error when adding a car");

                return response.json();
            })
        .catch(err => console.log(err))

    }

    return (<>
        <AddCar addCar={addCar} />
        <div className="ag-theme-material" style={{width: 1000, height: 550}}>
            <AgGridReact rowData={cars} columnDefs={columnDefs} pagination={true}
                    paginationAutoPageSize={true}  />

        </div>
        </>
        );
}