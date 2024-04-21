import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { CSSTransition } from 'react-transition-group';
import './index.css';
import { Start } from './scenes/Start.jsx';
import { Budget } from './scenes/Budget.jsx';
import { Days } from './scenes/Days.jsx';
import { RadioList } from './scenes/RadioList.jsx';
import { DestinationList } from "./scenes/DestinationList.jsx";
import { Reason } from "./scenes/Reason.jsx";
import data from './data.json';
import Spinner from "react-spinner-material";

const topPicks = data.activities;
const weatherConditions = data.weatherConditions;
const continents = data.continents;

function App() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false); // State for loading spinner
    const [destinationData, setDestinationData] = useState([]);

    const [checkedItemsWeather, setCheckedItemsWeather] = useState([]);

    const [checkedItemsActivities, setCheckedItemsActivities] = useState([]);

    const [checkedItemsContinents, setCheckedItemsContinents] = useState([]);

    const [tripDuration, setTripDuration] = useState(4); // Initial value for trip duration

    const [vacationBudget, setVacationBudget] = useState(1000); // Initial value for vacation budget




    const fetchDestinationData = async () => {
        try {
            setLoading(true); // Set loading to true before API call

            const requestBody = {
                "Budget": vacationBudget,
                "Days": tripDuration,
                "Activities": checkedItemsActivities.map(id => topPicks.find(item => item.id === id)?.name),
                "Weather": checkedItemsWeather.map(id => weatherConditions.find(weather => weather.id === id)?.req),
                "Continents": checkedItemsContinents.map(id => continents.find(item => item.id === id)?.name)
            };

            console.log(requestBody);

            const response = await fetch('http://localhost:5000/process_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();


            console.log(data.cities);

            console.log(data);

            setDestinationData(data.cities); // Set destinationData when API returns

            setLoading(false); // Set loading to false after API call

        } catch (error) {
            console.error('Error fetching destination data:', error);
            setLoading(false); // Set loading to false in case of error
            setDestinationData([]); // Reset destinationData on error
        }
    };

    const handleContinue = () => {
        if (currentStep === 6){
            fetchDestinationData().then( () => {setCurrentStep(currentStep + 1);});
        }
        else
            setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Start onContinue={handleContinue} />;
            case 2:
                return <Days onPrevious={handlePrevious} onContinue={handleContinue} tripDuration={tripDuration} setTripDuration={setTripDuration} />;
            case 4:
                return <Reason key="activities" name={<> Let us know what <br /> is the reason you <br /> want to travel <br /> </>} data={topPicks} checkedItems={checkedItemsActivities} setCheckedItems={setCheckedItemsActivities} onPrevious={handlePrevious} onContinue={handleContinue} />;
            case 3:
                return <RadioList key="weather" name={<> What is your <br /> weather based on <br /> the reason for <br /> the trip </>} data={weatherConditions} checkedItems={checkedItemsWeather} setCheckedItems={setCheckedItemsWeather} onPrevious={handlePrevious} onContinue={(selection) => handleContinue(selection, "selectedWeather")} />;
            case 5:
                return <Budget key="budget" onPrevious={handlePrevious} onContinue={handleContinue} vacationBudget={vacationBudget} setVacationBudget={setVacationBudget} />;
            case 6:
                return <RadioList key="continent" name={<> Let us know <br /> what is your <br /> preferred continent <br /> for your trip <br /> </>} data={continents} checkedItems={checkedItemsContinents} setCheckedItems={setCheckedItemsContinents} onPrevious={handlePrevious} onContinue={handleContinue} />;
            case 7:
                return (
                    <>
                        {loading ? (
                            <div className="flex justify-center items-center h-screen">
                                <Spinner radius={256} spinnerWidth={100} visible={true} color={"#fc0000"}/>
                            </div>
                        ) : (
                            <DestinationList data={destinationData} />
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="hero" style={{ position: "relative", overflow: "hidden", width: "100vw", height: "100vh" }}>
                <video muted loop id="video-bg" className={"blur-sm -z-10"} style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                    <source src="./src/assets/globe.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {renderStep()}
            </div>
        </>
    );
}

export default App;
