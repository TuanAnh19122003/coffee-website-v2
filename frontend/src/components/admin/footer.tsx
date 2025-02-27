'use client'
import React from 'react'

function Footer() {
    return (
        <footer style={{ textAlign: "center", padding: "16px", background: "#f0f2f5" }}>
            Website Coffee ©{new Date().getFullYear()} - All rights reserved.
        </footer>
    )
}

export default Footer