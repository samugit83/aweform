'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch, useStore } from 'react-redux'
import {update_Publishtime,
        update_Sponsored,
        update_Sponstype,
        update_TotalCost } from '@/redux/reduxfeat/manageformslice'  


const PublishOptions = (props) => {

    const sponstype_list = props.sponstype_list
    const sponstime_cost = props.sponstime_cost

    const dispatch = useDispatch()
    const store = useStore()

    const Publishtime = useSelector((state) => state.manageform.Publishtime)
    const Sponsored = useSelector((state) => state.manageform.Sponsored)
    const Sponstype = useSelector((state) => state.manageform.Sponstype)


    const getDefaultCost = () => {
        const state = store.getState();
        return state.manageform.DefaultCost;
    };


    const updateTotalPanCost = () => {

        dispatch(update_TotalCost(getDefaultCost() + 
                 sponstime_cost[Publishtime] + 
                 (!Sponstype ? 0 : sponstype_list.find(item => item.label === Sponstype).credits_cost)))
        
    }

    useEffect(() => {
        updateTotalPanCost();
    }, [Publishtime, Sponstype]);


    const handleSponsored = () => {
        dispatch(update_Sponstype(!Sponsored ? sponstype_list[0].label : false))
        dispatch(update_Sponsored(!Sponsored))
    }

    const handlePublishtime = (days) => {
        dispatch(update_Publishtime(days))
    }

    const handleOptionChange = (e) => {
        dispatch(update_Sponstype(e.target.value))
    };




    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 bg-white rounded-xl overflow-hidden p-3 shadow-md">
            <div className="flex flex-col items-center bg-white p-3">
                <p className="font-bold text-secondary">Ad Display Period:</p>
                <div className="text-secondary flex mt-2">
                    <div onClick={() => handlePublishtime('3')} className={`${Publishtime === '3' ? 'scale-125 text-white bg-confirm' : 'bg-white'} border-secondary border-2 w-[2rem] h-[1.5rem] text-center hover:bg-confirmlight hover:scale-110 hover:text-white cursor-pointer transition-all duration-900`}>
                        3
                    </div>
                    <div className="border-b-2 border-secondary w-[1rem] h-[0.8rem] text-center">
                    </div>
                    <div onClick={() => handlePublishtime('2')} className={`${Publishtime === '2' ? 'scale-125 text-white bg-confirm' : 'bg-white'} border-secondary border-2 w-[2rem] h-[1.5rem] text-center hover:bg-confirmlight hover:scale-110 hover:text-white cursor-pointer transition-all duration-900`}>
                        2
                    </div>
                    <div className="border-b-2 border-secondary w-[1rem] h-[0.8rem] text-center">
                    </div>
                    <div onClick={() => handlePublishtime('1')} className={`${Publishtime === '1' ? 'scale-125 text-white bg-confirm' : 'bg-white'} border-secondary border-2 w-[2rem] h-[1.5rem] text-center hover:bg-confirmlight hover:scale-110 hover:text-white cursor-pointer transition-all duration-900`}>
                        1
                    </div>
                    <p className="font-bold ml-2">DAYS</p>
                </div>
                <p className="mt-2 text-2xs text-center">Choose the number of days your car will be published.</p>
                <div className="flex items-center">
                    <p className="mt-1 text-lg font-bold mr-1">{!sponstime_cost[Publishtime] ? '' : '+ ' + sponstime_cost[Publishtime]}</p>
                    <Image
                        src="/images/dollar_icon.png"
                        width={0}
                        height={0}
                        hidden={Publishtime === '1' ? true : false}
                        sizes="100vw"
                        style={{ width: '21px', height: '21px' }} 
                    />
                </div>
            </div>
            <div className="flex flex-col items-center bg-white p-3 border-l-2 border-gray-200">
                <div className="flex">
                    <input
                        type="checkbox"
                        checked={Sponsored}
                        onChange={handleSponsored}
                        className="cursor-pointer h-5 w-5"
                    />
                    <p className="font-bold ml-2">Sponsored Ad</p>
                </div>
                <p className="text-md mt-1 mb-1">Options list:</p>
                <div className="flex justify-center flex-wrap space-x-2 text-sm font-medium">
                    {sponstype_list.map(item => {
                        return(
                            <label key={item.key}>
                                <input
                                type="radio"
                                name="option"
                                value={item.label}
                                checked={Sponstype === item.label}
                                onChange={handleOptionChange}
                                disabled={!Sponsored ? true : false}
                                className={'mr-1'}
                                />
                                {item.label}
                            </label>
                        )
                    })}
                </div>
                <p className="mt-1 text-2xs text-center">Choose Extra Sponsorship Features to Boost your Supercar Visibility.</p>
                <div className="flex items-center">
                    <p className="mt-1 text-lg font-bold mr-1">{!Sponstype ? '' : '+ ' + sponstype_list.find(item => item.label === Sponstype).credits_cost}</p>
                    <Image
                        src="/images/dollar_icon.png"
                        width={0}
                        height={0}
                        hidden={!Sponstype}
                        sizes="100vw"
                        style={{ width: '21px', height: '21px' }} 
                    />
                </div>
            </div>
        </div>
    )

}

export default PublishOptions