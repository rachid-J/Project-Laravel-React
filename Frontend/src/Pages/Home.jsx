


import { useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'
// import Logo from '../picture/Logo.png'


export default function Home() {

  const navigate = useNavigate()

  return (
    <section className="relative bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen py-20 text-center">
      

      {/* Hero Content */}
      <div className="max-w-screen-lg mx-auto px-6 mt-32">
        <h1 className="text-5xl font-extrabold text-gray-800 sm:text-6xl tracking-tight">
          The Ultimate POS System for Your Business
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 md:max-w-2xl mx-auto">
          Streamline your business operations and enhance your customer
          experience with our all-in-one POS system.
        </p>
        <div className="mt-8">
          <button
            onClick={() => navigate("/sign_up")}
            className="bg-green-600 px-8 py-4 text-xl text-white rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  )
}
