'use client'

import Image from 'next/image';
import { useSelector } from 'react-redux';


export default function CarSpace({queryresult}) {

    const LiveCarsList = useSelector((state) => state.manageform.LiveCarsList)
    const active_data = !LiveCarsList.length ? queryresult : LiveCarsList

	return (
			<div className="h-full w-full p-6 gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 overflow-y-auto flex-start" style={{backgroundColor: 'rgba(255,255,255,0.7)', alignContent: 'flex-start'}}>	
                {[...active_data].map(item => {
                    return (
                        <div key={item.car_id} className="glass-container p-3 overflow-hidden pulse-animation">
                            <Image
                                src={item.img_url}
                                alt="supercar"
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto'}} 
                            />
                            <div className="relative h-30 w-full text-foreground mt-4">
                                <p className="text-2xl font-semibold">{item.model}</p>
                                <p className="text-xl font-semibold"><span className="font-thin">by </span>{item.carmanu}</p>
                                <p className="text-lg font-semibold"><span className="font-thin">maxspeed: </span>{item.maxspeed} mph</p>
                            </div>
                        </div>
                    )
                })}
			</div >

	)
}

