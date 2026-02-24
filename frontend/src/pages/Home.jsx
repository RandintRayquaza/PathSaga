
import React from 'react'

const PathSaga = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 font-sans text-slate-900">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
          PathSaga
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Embark on a transformative journey. Map your ambitions, track your evolution, 
          and master the narrative of your personal and professional growth.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl mb-4 mx-auto">✦</div>
            <h3 className="font-bold text-xl mb-2">Explore</h3>
            <p className="text-slate-500 text-sm">Discover new horizons and define your ultimate objectives.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600 text-2xl mb-4 mx-auto">◈</div>
            <h3 className="font-bold text-xl mb-2">Navigate</h3>
            <p className="text-slate-500 text-sm">Break down complex paths into actionable, daily milestones.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-fuchsia-100 rounded-2xl flex items-center justify-center text-fuchsia-600 text-2xl mb-4 mx-auto">❖</div>
            <h3 className="font-bold text-xl mb-2">Conquer</h3>
            <p className="text-slate-500 text-sm">Visualize your progress and celebrate every victory along the way.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">
            Start Your Saga
          </button>
          <button className="bg-white text-slate-600 border border-slate-200 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95">
            View Demo
          </button>
        </div>
      </div>
      
      <footer className="mt-24 text-slate-400 text-sm font-medium">
        &copy; {new Date().getFullYear()} PathSaga. All rights reserved.
      </footer>
    </div>
  )
}

export default PathSaga
