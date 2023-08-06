import React, { useContext, useState, createContext } from 'react'

const PdfContext = createContext(null)

export const usePDF = () => {
    return useContext(PdfContext)
}
const PdfProvider = ({ children }) => {

    const [PDFs, setPDFs] = useState([])

    return (
        <PdfContext.Provider value={[PDFs, setPDFs]}>
            {children}
        </PdfContext.Provider>
    )
}

export default PdfProvider