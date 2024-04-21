import React, { useState } from 'react';

export function DestinationList({ data }) {
    const [activeTab, setActiveTab] = useState(null);

    const toggleTab = (id) => {
        setActiveTab(activeTab === id ? null : id);
    };

    const handleContinueClick = (url) => {
        console.log("Book button clicked for destination",url);
        window.open(url, '_blank');

        // Handle the booking action here
    };

    return (
        <div className="text-center max-w-md absolute top-24 left-32 flex flex-col">
            <h1 className="text-5xl font-bold top-52 pt-8 pb-8">
                Our top picks <br />
                based on your <br />
                preferences <br />
            </h1>

            {data.map((destination) => (
                <div key={destination.city + destination.country} className="flex flex-col items-center">
                    <div key={destination.city + destination.country} className="flex flex-row">
                        <button
                            className={`tab-title ${activeTab === destination.city + destination.country ? 'bg-gray-600' : 'bg-gray-400'} text-black text-xl m-2 w-56 rounded-lg hover:shadow-3xl focus:outline-none mr-2`}
                            onClick={() => toggleTab(destination.city + destination.country)}
                        >
                            {destination.city}, {destination.country}
                        </button>
                        {activeTab === destination.city + destination.country && (
                            <div className="absolute left-96 bg-gray-100 border border-gray-300 rounded-lg p-4 w-96">
                                <p className="text-lg font-bold text-primary-content">{destination.short_description}</p>
                                <div className="mt-4 font-bold text-primary">
                                    <p>Average Price: {destination.avg_price} €</p>
                                    <p>Cost of Living: {destination.cost_life} €</p>
                                    <p>Cost of Flight: {destination.average_flight_cost} €</p>

                                    <h3 className="text-lg mt-4">Top 3 Activities:</h3>
                                    <ul className=" pl-4 space-y-1">
                                        {destination.top_3_act.map((activity, index) => (
                                            <li key={index} className="text-sm">{activity}</li>
                                        ))}
                                    </ul>
                                    {/* Example of rendering weather data */}


                                    <button
                                        className="btn btn-primary mt-4 w-full"
                                        onClick={() => handleContinueClick(destination.url)}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
