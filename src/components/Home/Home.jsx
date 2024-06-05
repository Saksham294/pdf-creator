import React, { useState, useRef, useEffect } from 'react'
import './Home.css'
import jsPDF from 'jspdf'
import { Typography } from '@mui/material'
import StopIcon from '@mui/icons-material/Stop';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FaFilePdf } from "react-icons/fa";

// const openai=new OpenAI({
//     apiKey:process.env.REACT_APP_OPENAI_API_KEY,
//     // dangerouslyAllowBrowser: true
// })

const Home = () => {

    const textAreaRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const handleButtonClick = () => {
        setIsLoading(!isLoading)
    }
    useEffect(() => {
        const textArea = textAreaRef.current;
        if (textArea) {
            const handleInput = () => {
                textArea.style.height = 'auto';
                textArea.style.height = `${textArea.scrollHeight}px`;
                if (textArea.value === '') {
                    textArea.style.height = '42px';
                }
            };
            textArea.addEventListener('input', handleInput);
            return () => {
                textArea.removeEventListener('input', handleInput);
            };
        }
    }, []);
    return (
        <div className='home-container'>
            <div className="home-header">
                <FaFilePdf className='pdf-icon' />
                <Typography variant='h3'>PDF Creator</Typography>
            </div>
            <div className="pdf-input">
                <textarea
                    ref={textAreaRef}
                    type="text"
                    placeholder="
                    Enter details about the PDF you want to create...
                    "
                    className="pdf-input-text"
                />
                <button
                    className={`pdf-button${isLoading ? '-disabled' : ''}`}
                    onClick={handleButtonClick}
                    disabled={isLoading || isEmpty}
                >
                    {isLoading ?
                        <StopIcon className='stopIcon' sx={{ paddingTop: "0.5vh" }} /> :
                        <ArrowForwardIcon className='goIcon' sx={{ paddingTop: "0.5vh" }} />}
                </button>
            </div>
        </div>
    )
}

export default Home


