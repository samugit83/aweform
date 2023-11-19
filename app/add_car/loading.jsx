
import AddCarForm from '@/components/addcarform'; 
import {Skeleton} from "@nextui-org/react";

export default function Loading() {

    return(
        <div className="h-full w-full lg:flex scrollbar-hidden">
			<div className={`h-full w-full overflow-y-auto p-6 lg:w-[50rem] bg-background scrollbar-hidden`} >
				<AddCarForm />
			</div>
			<div className="h-full w-full bg-cover lg:flex-grow scrollbar-hidden">
                <Skeleton className="h-3 w-5/5 rounded-lg mx-5 my-7"/>
                <Skeleton className="h-3 w-4/5 rounded-lg mx-5 my-7"/>
                <Skeleton className="h-3 w-3/5 rounded-lg mx-5 my-7"/>
                <Skeleton className="h-3 w-2/5 rounded-lg mx-5 my-7"/>
                <Skeleton className="h-3 w-1/5 rounded-lg mx-5 my-7"/>
			</div>
        </div>
    )
    
}
