import React from 'react'

function Avatar({image  , name , size}) {
    return image ? (
            <div className={`rounded-full h-10 w-10 object-contain overflow-hidden flex items-center justify-center `}>
                <img src={`data:image/jpeg;base64,${image}`} className='h-full w-full' alt={name[0].toUpperCase()} />
            </div>
    ) :  (
        <div className={`h-10 w-10 rounded-full bg-theme-200  p-1  text-white flex items-center justify-center  `}>
            <span className=''>{name[0].toUpperCase()}</span>
        </div>
    )
}

export default Avatar