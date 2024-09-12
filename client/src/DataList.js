import React, { useState, useEffect } from 'react';
import ImageLoader from './Component/image_loader';

function DataList() {
    const [dataM, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(24);
    const [status, setStatus] = useState(0);
    const [nowScraping, setNowScraping] = useState(false);

    const Cheack_Status = async() => {
        while(status === 0) {
            try {
                const response = await fetch(`https://backend-toc.onrender.com/status`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json(); 
                setStatus(data);
                if (data === 0) {
                    fetchData();
                    break; 
                }
            } catch (error) {
                console.log("Fetch Error:", error.message);
                break;
            }
            await sleep(10000);
            await sleep(10000);
        }
    }

    const Get_Status = async () => {
        try {
            const response = await fetch(`https://backend-toc.onrender.com/status`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setStatus(data);
            if (dataM.length === 0) {
                fetchData();
            if(data === 1){
                Cheack_Status()
            }
            }
        } catch (error) {
            console.log("Fetch Error:", error.message);
        }
    };

    useEffect(() => {
        Get_Status();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`https://backend-toc.onrender.com/movies`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(data);
            setFilteredData(data);
        } catch (error) {
            console.log("Fetch Error:", error.message);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredData(dataM);
        } else {
            try {
                const regex = new RegExp(searchTerm, "i");
                const filtered = dataM.filter(item =>
                    regex.test(item._Movie__title) || regex.test(item._Movie__director) || regex.test(item._Movie__genre)
                );
                const sortedFiltered = filtered.sort((a, b) => a.Id - b.Id);
                setFilteredData(sortedFiltered);
            } catch (error) {
                console.error("Invalid regular expression: ", error);
                setFilteredData([]);
            }
        }
    }, [searchTerm, dataM]);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleClick = (item) => {
        setSelectedItem(item);
    };

    const handleClosePopup = () => {
        setSelectedItem(null);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    const currentItems = filteredData.slice(start, end);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const onclick_download_button = async () => {
        try {
            const response = await fetch(`https://backend-toc.onrender.com/download`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'movies_data.csv'; // Set the desired file name and extension
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log("Download Error:", error.message);
        }
    };


    const Show_Status = () => {
        if (status === 0) {
            return <p style={{ color: "white" }}>Not Scraping</p>;
        } else if (status === 1) {
            return <p style={{ color: "white" }}>Scraping</p>;
        }
        return null;
    };

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }

    const Scraping = async () => {
        if (nowScraping) return;
        
        setNowScraping(true);
        setStatus(1);
        try {
            const response = await fetch(`https://backend-toc.onrender.com/scaping`);
            if (!response.ok) {
                throw new Error('Failed to scrape data');
            }
            const data = await response.json();
            console.log(data.message);
            if (data.message === "Scraping completed successfully.") {
                fetchData();
                Get_Status();
            }
        } catch (error) {
            console.log("Scraping Error:", error.message);
        } finally {
            setNowScraping(false);
        }
    };

    return (
        <div>
            <div className="navbar">
                <h1 className="navbar-title">IMDD</h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleChange}
                    className="navbar-search"
                />
                <button onClick={Scraping}>Scraping</button>
                <button onClick={onclick_download_button}>Download</button>
                
            </div>
            <Show_Status />
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                onPageChange={handlePageChange}
            />
            {filteredData.length > 0 ? (
                <div className="card-container">
                    {currentItems.map(item => (
                        <div key={item.Id} className="card" onClick={() => handleClick(item)}>
                            <ImageLoader url={item["_Movie__url_picture"]} title={item._Movie__title} />
                            {/* <img src={item["_Movie__url_picture"]} alt={item._Movie__title} className="card-image" /> */}
                            <div className="card-content">
                                <h4><b>{item._Movie__title}</b></h4>
                                <p><strong>Score:</strong> {item._Movie__score}⭐</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No data found</p>
            )}
            {selectedItem && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedItem._Movie__title}</h2>
                        <p><strong>Duration:</strong> {selectedItem._Movie__duration}</p>
                        <p><strong>Director:</strong> {selectedItem._Movie__director}</p>
                        <p><strong>Genre:</strong> {selectedItem._Movie__genre}</p>
                        <p><strong>Description:</strong> {selectedItem._Movie__description}</p>
                        <button onClick={handleClosePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const PaginationControls = ({ currentPage, totalPages, itemsPerPage, onItemsPerPageChange, onPageChange }) => {
    return (
        <div className="pagination-controls">
            <select value={itemsPerPage} onChange={onItemsPerPageChange}>
                {[24, 48].map((num) => (
                    <option key={num} value={num}>
                        {num} items per page
                    </option>
                ))}
            </select>
            <div className="pagination">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {[...Array(totalPages).keys()].map((i) => (
                    <button
                        key={i}
                        className={i + 1 === currentPage ? 'active' : ''}
                        onClick={() => onPageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DataList;
