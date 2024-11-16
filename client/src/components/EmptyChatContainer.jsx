import emptyImage from '../assets/4957160.jpg'
import Lottie from 'lottie-react'
import data from '../assets/Animation - 1731609974026.json'
const EmptyChatContainer = () => {
    return (
        <div className='flex-1 hidden items-center justify-center flex-col lg:flex z-0 pointer-events-none'>
            <div className="h-96 w-96 object-cover">
                <Lottie animationData={data} loop={true} />
            </div>
            <div className=''>
                <span className='font-black text-3xl tracking-wider '>Stay Connected !</span>
            </div>
        </div>
    )
}

export default EmptyChatContainer