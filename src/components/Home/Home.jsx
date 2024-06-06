import React, { useState, useRef, useEffect } from 'react'
import './Home.css'
import { Typography } from '@mui/material'
import { FaFilePdf } from "react-icons/fa";

const Home = () => {

    const textAreaRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)
    const [inputText, setInputText] = useState('')
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [isEmpty, setIsEmpty] = useState(true)
    const [messageIndex, setMessageIndex] = useState(0);
    const [error, setError] = useState(null)
    const messages = [
        'Please wait...',
        'We are creating your PDF...',
        'Your PDF will automatically get downloaded.',
    ];
    const handleButtonClick = () => {
        if (!isEmpty) {
            sendRequest();
            setInputText('')
        }
    }
    console.log(process.env.REACT_APP_URL)
    const sendRequest = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pages: numberOfPages, text: inputText }),
            });
            if (!response.ok) {
                console.log(response)
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`)
            }
            console.log(response)
            const blob = await response.blob();
            const pdfURL = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = pdfURL;
            link.setAttribute('download', 'output.pdf'); // Name of the output PDF
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching the PDF:', error);
        } finally {
            setIsLoading(false);
        }
    };
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
    useEffect(() => {
        if (isLoading) {
            const messageTimers = [
                setTimeout(() => setMessageIndex(1), 2000), // 2 seconds delay
                setTimeout(() => setMessageIndex(2), 4000), // 4 seconds delay
                setTimeout(() => setMessageIndex(0), 6000), // 6 seconds delay
            ];

            // Cleanup timers when loading is finished or component is unmounted
            return () => {
                messageTimers.forEach(timer => clearTimeout(timer));
            };
        }
    }, [isLoading]);
    return (
        <div className='home-container'>
            <div className="home-header">
                <div className="heading">
                    <FaFilePdf className='pdf-icon' />
                    <Typography variant='h3'>PDF Creator</Typography>
                </div>
                <div className="sub-heading">
                    <Typography variant='h6'>Create your PDFs in minutes</Typography>
                </div>
            </div>
            <div className="pdf-input">
                <label htmlFor="pdf-input-number" className="pdf-label">Number of pages</label>
                <input
                    type="text"
                    placeholder="Number of pages"
                    value={numberOfPages}
                    onChange={(e) => {
                        setNumberOfPages(Number(e.target.value))
                    }}
                    className="pdf-input-number"
                />
                <label htmlFor="pdf-input-text" className="pdf-label">Describe your PDF</label>
                <textarea
                    ref={textAreaRef}
                    type="text"
                    placeholder="Enter details about the PDF you want to create. Describe how each page should look like. The more details you provide the better the PDF will be."
                    value={inputText}
                    onChange={(e) => {
                        setInputText(e.target.value)
                        setIsEmpty(e.target.value === '')
                    }}

                    className="pdf-input-text"
                />
                <button
                    className={`pdf-button${isLoading || isEmpty || numberOfPages < 1 ? '-disabled' : ''}`}
                    onClick={handleButtonClick}
                    disabled={isLoading || isEmpty || numberOfPages < 1}
                >
                    {isLoading ?
                        <Typography variant='h6'>Creating PDF...</Typography>
                        : <Typography variant='h6'>Create PDF</Typography>
                    }
                </button>

            </div>
            {isLoading ? <Typography variant='h6'>{messages[messageIndex]}</Typography> : null}
            {error ? <Typography variant='h5'>{error}</Typography> : null}
        </div>
    )
}

export default Home


