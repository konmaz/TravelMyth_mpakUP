import React, { useState } from 'react';

export function Budget({onPrevious, onContinue, vacationBudget, setVacationBudget}) {

    const handleChange = (event) => {
        setVacationBudget(event.target.value); // Update vacationBudget state with the new value
    };

    const handleContinueClick = () => {
        onContinue(vacationBudget);
    };

    return (
        <>
            <div className="text-center ">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold absolute top-96 left-32 pt-8 pb-8"> 
                        Let us know your <br/> 
                        vacation budget <br/>                     
                    </h1>
                    <div className="flex flex-col items-center w-96 absolute right-44 bottom-96">
                        <p className="p-6">${vacationBudget}</p>
                        <input type="range" min={0} max={2000} value={vacationBudget} className=" range"
                            onChange={handleChange}/>
                        <div className='flex flex-row'>
                            <button className="info-container btn btn-primary right-56 mt-4 mr-2 w-32" onClick={onPrevious}> Previous </button>
                            <button className="info-container btn btn-primary right-56 mt-4 w-32" onClick={handleContinueClick}> Continue </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
