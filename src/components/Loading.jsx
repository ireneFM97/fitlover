import React from "react";
import '../assets/styles/Loading.css';

export const Loading = () => {
    return (
        <div className="loader">
            <div data-glitch="Loading..." className="glitch">Loading...</div>
        </div>


    );
};

export default Loading;