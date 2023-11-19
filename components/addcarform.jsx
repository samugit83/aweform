'use client'
import React, {useState, useMemo} from "react";
import {Input, Select, SelectItem} from "@nextui-org/react"
import {DropImage, DropPdf} from "@/components/dropzone"
import crypto from "crypto";
import Image from "next/image"
import PublishOptions from "@/components/publishoptions"
import { useSelector, useStore, useDispatch } from 'react-redux'
import { update_LiveCarsList } from '@/redux/reduxfeat/manageformslice'  
import { UpdateItem, QueryTab } from '@/server_actions/dynamo_db';

const user_data = {  
    user: "currentuser@gmail.com",
    credits: 1900
}

const sponstype_list = [
    {
    key: '1',
    label: 'PromoPulse',
    credits_cost: 50
    },
    {
    key: '2',
    label: 'AdMagnetix',
    credits_cost: 100
    },
    {
    key: '3',
    label: 'BoostBurst',
    credits_cost: 300
    },
    {
    key: '4',
    label: 'SponsorSpire',
    credits_cost: 600
    },          
    {
    key: '5',
    label: 'ClickCatalyst',
    credits_cost: 1000
    }          
  ]
  
  
  const sponstime_cost = {
    '1': 0,
    '2': 200,
    '3': 350
  }

  
const generateRandomString = (length) => {
   return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};



const AddCarForm = () => {

    const initialInputs = useMemo(() => {
        return {
          car_id: generateRandomString(15),
          status: "draft",
          model: "",
          maxspeed: "",
          brandurl: "",
          carmanu: "",
          convcar: false
        };
      }, []);

    const [inputs, setInputs] = useState(initialInputs);
    const store = useStore()
    const dispatch = useDispatch()



    const validations = useMemo(
        () => ({
            model: (value) => /^(?=.*\S).{3,}$/i.test(value),
            maxspeed: (value) => /^\d+$/i.test(value),
            brandurl: (value) => /www\./i.test(value)
        }));

    


    const isInvalid = useMemo(() => {

        return (name) => {
            const validation = validations[name];

            if(inputs[name] === "") {return false};
            return !validation || !validation(inputs[name]);
        };

    }, [inputs, validations]);


    const handleInputChange = (name, value) => {
        setInputs((prevInputs) => ({
          ...prevInputs,
          [name]: value,
        }));
      };

    const GenerateTodayDatestring = () => {

        let today_date = new Date()
        let datestring = Number(`${today_date.getFullYear()}${(today_date.getMonth() + 1).toString().padStart(2, '0')}${today_date.getDate().toString().padStart(2, '0')}`);
        
        return datestring
    
    }

    const carmanu_list = [
        "Ferrari",
        "Lamborghini",
        "Bugatti",
        "McLaren",
        "Porsche",
        "Koenigsegg",
        "Aston Martin",
        "Pagani",
        "Lexus",
        "Lotus"
      ];

    const getManageFormData = () => {
        const state = store.getState();
        return state.manageform;
    };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const ManageFormData = getManageFormData()

    const publish_options = {
      car_id: inputs.car_id,
      publish_options_id: generateRandomString(15),
      status: 'live',
      datestring_creation: GenerateTodayDatestring(),
      publishtime: Number(ManageFormData.Publishtime),
      sponsored: ManageFormData.Sponsored,
      sponstype: ManageFormData.Sponstype
    }

    let update_car_response = await UpdateItem("cars", "car_id", inputs.car_id, ["status", "publish_options"], ["live", [publish_options]])

    if(update_car_response) {
      const QueryResult = await QueryTab("cars", "status-index", "status", "live");
      dispatch(update_LiveCarsList(QueryResult))
    }
  }




   const allValidStatus = useMemo(() => {
    return () => {
        return (
          !isInvalid("model") &&
          inputs.model &&
          !isInvalid("maxspeed") &&
          inputs.maxspeed &&
          !isInvalid("brandurl") &&
          inputs.brandurl &&
          inputs.carmanu
        )
      };
    }, [isInvalid, inputs]);


    const TotalCost = useSelector((state) => state.manageform.TotalCost)
    const ImgUploadStatus = useSelector((state) => state.manageform.ImgUploadStatus)
    const PdfUploadStatus = useSelector((state) => state.manageform.PdfUploadStatus)

   return (
    <form className="w-full text-gray-500" onSubmit={handleSubmit}>
        <Image
            src="/images/car_logo.png"
            width={0}
            height={0}
            sizes="100vw"
            style={{width: "250px", height: "110px", marginBottom: "20px", margin: "auto"}}
        />
        <p className="text-3xl font-semibold mb-5">Add a supercar</p>
        <div className="h-20">
            <Input
                value={inputs.model}
                type="text"
                label="Supercar model name"
                name="model"
                variant="bordered"
                isInvalid={isInvalid("model")}
                color={isInvalid("model") ? "danger" : "success"}
                errorMessage={isInvalid("model") && "Please enter a valid model name."}
                onValueChange={(value) => handleInputChange("model", value)}
                classNames={{
                    inputWrapper: ["bg-white"],
                }}
            />
        </div>
        <div className="h-20">
            <Input
                value={inputs.maxspeed}
                type="text"
                label="Maximum Speed mph"
                name="maxspeed"
                variant="bordered"
                isInvalid={isInvalid("maxspeed")}
                color={isInvalid("maxspeed") ? "danger" : "success"}
                errorMessage={isInvalid("maxspeed") && "Please enter a valid number."}
                onValueChange={(value) => handleInputChange("maxspeed", value)}
                classNames={{
                    inputWrapper: ["bg-white"],
                }}
            />
        </div>
        <div className="h-20">
            <Input
                value={inputs.brandurl}
                type="text"
                label="Brand website URL"
                name="brandurl"
                variant="bordered"
                isInvalid={isInvalid("brandurl")}
                color={isInvalid("brandurl") ? "danger" : "success"}
                errorMessage={isInvalid("brandurl") && "Please enter a valid url."}
                onValueChange={(value) => handleInputChange("brandurl", value)}
                classNames={{
                    inputWrapper: ["bg-white"],
                }}
            />
        </div>
        <div className="h-20">
            <Select
                variant="bordered"
                label="Select a Car manifacturer"
                color={"success"}
                onChange={(e) => handleInputChange("carmanu", e.target.value)}
                classNames={{
                trigger: ["bg-white"],
                }}
            >
                {carmanu_list.map((carmanu) => (
                    <SelectItem key={carmanu} value={carmanu}>
                        {carmanu}
                    </SelectItem>
                ))}
            </Select>
        </div>
        <div className="flex align-items">
            <p className="mr-3">Convertible car</p>
            <input 
              type="checkbox"
              name="convcar"
              checked={inputs.convcar}
              onChange={(e) => handleInputChange("convcar", e.target.checked)}
              className="cursor-pointer h-5 w-5"
            />
        </div>
        <p className="text-lg font-semibold mt-6 mb-2">Upload your supercar picture</p>
        <DropImage all_valid_status={allValidStatus()} form_data={inputs}/>
        <p className="text-lg font-semibold mt-6 mb-2">Upload a supercar specs PDF file</p>
        <DropPdf form_data={inputs} />
        <p className="text-lg font-semibold mt-6 mb-2">Choose your Ad options</p>
        <PublishOptions sponstype_list={sponstype_list} sponstime_cost={sponstime_cost} />
        <div className="flex flex-col items-center w-full mt-3">
          <p className="flex items-center text-lg font-bold">
            Total: {TotalCost}
            <Image
              src="/images/dollar_icon.png"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '21px', height: '21px', marginLeft: '5px', marginBottom: '2px'}} 
            />
          </p>
          <p className="text-xs">
            {user_data.credits - TotalCost >= 0 
            ? `${user_data.credits - TotalCost} credits Left` 
            : `You Need ${TotalCost - user_data.credits} credits More`}
          </p>
          <div
            className={`overflow-hidden font-semibold ${user_data.credits - TotalCost >= 0 ? "bg-secondary text-white" : "bg-white border-2 border-gray-300 text-gray-500"} text-center rounded-md shadow-md mt-4 hover:scale-110 cursor-pointer transition-all duration-900`} >
              {user_data.credits - TotalCost >= 0 
              ? ((allValidStatus() && ImgUploadStatus && PdfUploadStatus) ? 
                 <button type="submit" className="px-4 py-2" >SUBMIT</button> :
                 <div className="bg-white px-4 py-2 text-[red]">Complete all steps above before submitting.</div>)
              :  <button className="px-4 py-2">Get more credits</button>}
          </div>
        </div>
    </form>
   )


}

export default AddCarForm;