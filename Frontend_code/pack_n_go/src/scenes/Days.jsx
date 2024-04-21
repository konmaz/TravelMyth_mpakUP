import React, {useState} from 'react';

export function Days({onPrevious, onContinue, tripDuration, setTripDuration}) {


    const handleChange = (event) => {
        setTripDuration(event.target.value); // Update tripDuration state with the new value
    };

    const handleContinueClick = () => {
        onContinue(tripDuration);
    };

    return (
        <>
            <div className="text-center ">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold absolute top-80 left-32 pt-8 pb-8"> 
                        Let us know how <br/> 
                        long your trip is <br/>
                        taking place <br/>                     
                    </h1>
                    <div className="flex flex-col items-center w-96 absolute right-44 bottom-96">
                        <p className="p-6">{tripDuration} days</p> {/* Display the current value of tripDuration */}
                        <input type="range" min={1} max={10} value={tripDuration} className="range"
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
