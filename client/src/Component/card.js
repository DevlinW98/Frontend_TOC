import React, { useState, useEffect } from 'react'

export default function card({item, onClick}) {
    return (<div className="card" onClick={onClick}>
        <img src={item["_Movie__url_picture"]} alt={item._Movie__title} className="card-image" />
        <div className="card-content">
            <h4><b>{item._Movie__title}</b></h4>
            <p><strong>Score:</strong> {item._Movie__score}⭐</p>
        </div>
    </div>)
}