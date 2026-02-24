import React from 'react'

const NavBar = () => {
  return (
    <div className='flex justify-between items-center bg-slate-800 h-[10vh]'>
        <div>
            <h1 className='text-2xl font-bold tracking-tight leading-none hover:border-b-2 hover:border-slate-600 transition-all duration-300'>Path Saga</h1>
        </div>
        <nav className='flex justify-between items-center gap-4 cursor-pointer ' > 
            <h3 className=' opacity-20 hover:border-b-2 hover:border-slate-600 transition-all duration-300 hover:opacity-100 '>Home</h3>
            <h3 className=' opacity-20   hover:border-b-2 hover:border-slate-600 transition-all duration-300 hover:opacity-100 '>About</h3>
            <h3 className=' opacity-20   hover:border-b-2 hover:border-slate-600 transition-all duration-300 hover:opacity-100 '>How It works</h3>
            <h3 className=' opacity-20   hover:border-b-2 hover:border-slate-600 transition-all duration-300 hover:opacity-100 '>Contact</h3>
        </nav>

<div className="flex">
    <button className="px-6 py-3 mr-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium transition-all duration-300">
        Login
    </button>

</div>

    </div>
  )
}

export default NavBar