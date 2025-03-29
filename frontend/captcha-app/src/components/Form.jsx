import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AadhaarForm = () => {
    const [isInputEnabled, setIsInputEnabled] = useState(false);
    const [otpData, setOtpData] = useState('');

    const [interactionData, setInteractionData] = useState({
        mouse_movements: [],
        click_intervals: [],
        keypress_intervals: [],
        scroll_positions: [],
        idle_times: [],
        color_depth: window.screen.colorDepth,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        installed_plugins: navigator.plugins.length,
        installed_extensions: [],  // Extension logic can be added here if necessary
    });

    useEffect(() => {
        const getBrowserRenderingEngine = () => {
            const userAgent = navigator.userAgent;
            if (userAgent.includes("Edge") || userAgent.includes("Edg")) return "EdgeHTML";
            if (userAgent.includes("Chrome") || userAgent.includes("CriOS")) return "Blink";
            if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "WebKit";
            if (userAgent.includes("Firefox")) return "Gecko";
            return "Unknown";
        };

        const getOS = () => {
            let userAgent = window.navigator.userAgent;
            if (userAgent.indexOf("Win") !== -1) return "Windows";
            if (userAgent.indexOf("Mac") !== -1) return "MacOS";
            if (userAgent.indexOf("X11") !== -1) return "UNIX";
            if (userAgent.indexOf("Linux") !== -1) return "Linux";
            return "Unknown";
        };

        const getBrowser = () => {
            let userAgent = window.navigator.userAgent;
            if (userAgent.indexOf("Chrome") > -1) return "Chrome";
            if (userAgent.indexOf("Firefox") > -1) return "Firefox";
            if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) return "Safari";
            if (userAgent.indexOf("Edge") > -1) return "Edge";
            if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) return "Internet Explorer";
            return "Unknown";
        };

        // Update interaction data dynamically on component mount
        setInteractionData(prevData => ({
            ...prevData,
            os: getOS(),
            browser: getBrowser(),
            browser_rendering_engine: getBrowserRenderingEngine()
        }));

        let lastClickTime = Date.now();
        let keyDownTime = {};
        let lastActivityTime = Date.now();

        const handleMouseMove = (event) => {
            const currentTime = Date.now();
            setInteractionData(prevData => {
                const lastMovement = prevData.mouse_movements[prevData.mouse_movements.length - 1];
                const distance = lastMovement ? Math.sqrt(Math.pow(event.clientX - lastMovement.x, 2) + Math.pow(event.clientY - lastMovement.y, 2)) : 0;
                const timeElapsed = lastMovement ? (currentTime - lastMovement.timestamp) : 1;
                const speed = distance / timeElapsed;

                return {
                    ...prevData,
                    mouse_movements: [...prevData.mouse_movements, { x: event.clientX, y: event.clientY, timestamp: currentTime, speed, distance }]
                };
            });
        };

        const handleClick = (event) => {
            const currentTime = Date.now();
            const interval = currentTime - lastClickTime;
            const clickLocation = { x: event.clientX, y: event.clientY };

            if (interval > 0) {
                setInteractionData(prevData => ({
                    ...prevData,
                    click_intervals: [...prevData.click_intervals, { interval, location: clickLocation }]
                }));
            }
            lastClickTime = currentTime;
        };

        const handleKeyDown = (event) => {
            keyDownTime[event.key] = Date.now();
        };

        const handleKeyUp = (event) => {
            const currentTime = Date.now();
            const holdTime = currentTime - keyDownTime[event.key];
            setInteractionData(prevData => ({
                ...prevData,
                keypress_intervals: [...prevData.keypress_intervals, { key: event.key, interval: holdTime }]
            }));
            delete keyDownTime[event.key];
        };

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setInteractionData(prevData => ({
                ...prevData,
                scroll_positions: [...prevData.scroll_positions, scrollPosition]
            }));
        };

        const updateLastActivityTime = () => {
            lastActivityTime = Date.now();
        };

        const handleIdleTime = () => {
            const currentTime = Date.now();
            const idleTime = currentTime - lastActivityTime;
            if (idleTime > 1000) { // Example: consider idle if more than 1 second
                setInteractionData(prevData => ({
                    ...prevData,
                    idle_times: [...prevData.idle_times, idleTime]
                }));
            }
            lastActivityTime = currentTime;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        window.addEventListener('scroll', handleScroll);

        document.addEventListener('mousemove', updateLastActivityTime);
        document.addEventListener('click', updateLastActivityTime);
        document.addEventListener('keypress', updateLastActivityTime);

        const idleInterval = setInterval(handleIdleTime, 1000);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('scroll', handleScroll);

            document.removeEventListener('mousemove', updateLastActivityTime);
            document.removeEventListener('click', updateLastActivityTime);
            document.removeEventListener('keypress', updateLastActivityTime);

            clearInterval(idleInterval);
        };
    }, []);

    const submitData = async () => {
        console.log("interactionData :", interactionData);
        try {
            const csrfToken = getCookie('csrftoken');

            const response = await axios.post('http://localhost:8000/captcha/store-interaction-data/',
                interactionData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    }
                }
            );

            const data = response.data;
            if (data.is_human) {
                alert('OTP sent!');
                setIsInputEnabled(true);
            } else {
                alert('Problem in sending OTP!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const submitOtpData = async () => {
        try {
            const csrfToken = getCookie('csrftoken');

            const response = await axios.post('http://localhost:8000/otp/verify-otp/',
                otpData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    }
                }
            );

            const data = response.data;
            if (data.verification) {
                alert('Verification successful');
                window.location.reload();
            } else {
                alert('Problem in Verification!');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    return (
        <>
            <div className="unauth-eaadhaar-download__card-container">
                <div className="auth-form__select-label">
                    Select 12 digit Aadhaar Number /16 digit Virtual ID (VID) Number / 28 digit Enrollment ID (EID) Number
                </div>
                <div className="auth-form__radio-group">
                    <label className="auth-form__radio-button" htmlFor="uid">
                        <input type="radio" name="pvc" id="uid" />
                        <span className="auth-form__radio-button-label">Aadhaar Number</span>
                    </label>
                    <label className="auth-form__radio-button" htmlFor="eid">
                        <input type="radio" name="pvc" id="eid" />
                        <span className="auth-form__radio-button-label">Enrolment ID Number</span>
                    </label>
                    <label className="auth-form__radio-button" htmlFor="vid">
                        <input type="radio" name="pvc" id="vid" />
                        <span className="auth-form__radio-button-label">Virtual ID Number</span>
                    </label>
                </div>
                <div className="auth-form__form-container">
                    <div className="auth-form__text-field">
                        <div className="sc-fXSgeo gOcOUk" direction="ltr">
                            <div className="sc-JrDLc jWPGsS auth-form__text-field-inner-div auth-form__text-field-inner-div" direction="ltr">
                                <div className="sc-fjvvzt hrmueY">
                                    <label fontSize="" className="sc-bbSZdi laOEzn">
                                        Enter Aadhaar Number
                                    </label>
                                    <input id="aadharNumber" fontSize="" name="uid" autoComplete="off" min="" max="" placeholder=""
                                        className="sc-fBWQRz bjSLyk" />
                                    <br />
                                    
                                    <label fontSize="" className="sc-bbSZdi laOEzn" hidden={!isInputEnabled} >
                                        Enter OTP
                                    </label>
                                    <input fontSize="" name="otp" autoComplete="off" min="" max="" placeholder=""
                                        className="sc-fBWQRz bjSLyk" hidden={!isInputEnabled} onChange={(e) => setOtpData(e.target.value)} value={otpData} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="auth-form__button-container">
                        <div className="auth-form__button">
                            <button id="otpBtn" type="button" className="button_btn__HeAxz"
                                style={{ backgroundImage: 'linear-gradient(to right, rgb(2, 13, 81), rgb(25, 176, 220))', color: 'white'}}
                                onClick={isInputEnabled ? submitOtpData : submitData}>
                                {isInputEnabled ? 'Confirm OTP' : 'Send OTP'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AadhaarForm;