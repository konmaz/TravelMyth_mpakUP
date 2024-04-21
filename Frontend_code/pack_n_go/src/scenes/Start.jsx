export function Start({onContinue}) {
    return (
        <>
            <div className="text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold absolute top-72 left-32 pt-8 pb-8">
                        Welcome to the best <br/>
                        traveling experience <br/>
                        Continue and let us <br/>
                        select the best <br/>
                        choices for you
                    </h1>
                    <button className="info-container btn btn-primary absolute right-56 bottom-96 w-32"
                            onClick={onContinue}> Let's Begin →
                    </button>
                </div>
            </div>


            {/*<div className="flex flex-col w-full">*/}
            {/*    <div className="divider divider-start">Start</div>*/}
            {/*    <div className="divider">Default</div>*/}
            {/*    <div className="divider divider-end">End</div>*/}
            {/*</div>*/}
        </>
    )
}