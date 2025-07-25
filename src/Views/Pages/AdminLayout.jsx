import React from 'react'
import Navbar from '../Layout/Header/Navbar'
import AdminSidebar from '../Layout/Component/AdminSidebar'

const AdminLayout = ({ children }) => {
    return (
        <>
            <header className='sticky-top'>
                <Navbar />
                <AdminSidebar />
            </header>
            <main>
                {children}
            </main>
            <footer></footer>
        </>
    )
}

export default AdminLayout
