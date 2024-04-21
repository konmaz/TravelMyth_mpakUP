import React, { useState } from 'react';

export function RadioList({name, data, onPrevious, onContinue, checkedItems, setCheckedItems}) {


    const handleCheckboxChange = (itemId) => {
        const isChecked = checkedItems.includes(itemId);
        if (isChecked) {
            setCheckedItems(checkedItems.filter(id => id !== itemId));
        } else {
            setCheckedItems([...checkedItems, itemId]);
        }
    };

    const handleContinueClick = () => {
        onContinue(checkedItems);
    };

    return (
        <>
            <h1 className="text-5xl font-bold absolute top-80 left-32 pt-8 pb-8">{name}</h1>
            <div className="card bg-gray-600 p-6 w-auto max-w-md space-y-6 absolute right-56 bottom-60">
                <div className="space-y-2">
                    {data.map(item => (
                        <div key={item.id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={item.id}
                                value={item.id}
                                checked={checkedItems.includes(item.id)}
                                onChange={() => handleCheckboxChange(item.id)}
                                className="text-primary focus:ring-primary checkbox info-container"
                            />
                            <label className='text-black info-container cursor-pointer' htmlFor={item.id}>{item.name}</label>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row'>
                    <button className="info-container btn btn-primary mt-4 mr-2 w-32" onClick={onPrevious}> Previous </button>
                    <button className="info-container btn btn-primary mt-4 w-32" onClick={handleContinueClick}> Continue </button>
                </div>
            </div>
        </>
    );
}
