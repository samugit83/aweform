import AddCarForm from '@/components/addcarform';
import CarSpace from './car_space'; 
import { QueryTab } from '@/server_actions/dynamo_db';

export default async function Page() {

    const QueryResult = await QueryTab("cars", "status-index", "status", "live");

	return(
		<div className="h-full w-full lg:flex scrollbar-hidden">
			<div className={`h-full w-full overflow-y-auto p-6 lg:w-[50rem] bg-background scrollbar-hidden`} >
				<AddCarForm />
			</div>
			<div className="h-full w-full bg-cover lg:flex-grow scrollbar-hidden" style={{backgroundImage: 'url("/images/carbackground.png")'}}>
                <CarSpace queryresult={QueryResult}/>
			</div>
		</div>
	)

};