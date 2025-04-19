import React from "react";
import { CircleLoader, SyncLoader } from 'react-spinners';
import './spinner.scss';

export const Spinner = ({ show }) => {
    if (show) {
        return (

            <div className="loading-wrapper">
                <div className="pos">
                    <SyncLoader size={'10px'} color={'#FFF'} />
                </div>

            </div>
        );
    } else {
        return <></>;
    }

}

export const SpinnerLoading = ({ show, theme }) => {
    if (show) {
        return (
            <div className="loading-image">
                <SyncLoader size={'10px'} color={theme == 'dark' ? '#fff' : '#000'} />
            </div>
        );
    } else {
        return <></>;
    }

}

export const CircularSpinner = ({ show }) => {
    if (show) {
        return (

            <div className="loading-wrapper">
                <div className="pos">
                    <CircleLoader size={'10px'} color={'#166fe5'} />
                </div>

            </div>
        );
    } else {
        return <></>;
    }

}

export const BeginText = ({ show, open, text, theme }) => {
    if (show && !open) {
        return (
            <div className="loading-image">
                <p>{text}</p>
            </div>
        );
    } else {
        return <></>;
    }
}