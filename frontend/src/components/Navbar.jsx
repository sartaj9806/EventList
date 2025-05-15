import React from 'react'

const Navbar = () => {
    return (
        <div className='bg-green-500 p-4 flex justify-between items-center px-2 md:px-[10vw]'>
            <p className='text-lg font-bold'>a1Sartaj</p>

            <ul className='flex space-x-4'>
                <li className='font-bold text-base'>Home</li>
                <li className='font-bold text-base'>About</li>
                <li className='font-bold text-base'>Contact</li>
                <li className='font-bold text-base'>Services</li>
            </ul>
        </div>
    )
}

export default Navbar
