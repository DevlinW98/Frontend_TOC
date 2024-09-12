import React, { useState, useEffect } from 'react';

export default function ImageLoader({url, title}) {
    const [loaded, set_loaded] = useState(false)
    const [img_src, set_img_src] = useState(null)

    useEffect(() => {
        fetch(url).then(async (res) => { 
            const blob = await res.blob()
            const objURL = URL.createObjectURL(blob);
            set_loaded(true)
            set_img_src(objURL)
        })
    }, [])

    return loaded ? (
        <img src={img_src} alt={title} className="card-image" />
    ) : (<div className='spinner-wrapper'> 
        <span className="spinner" />
    </div>)
}