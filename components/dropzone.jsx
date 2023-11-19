'use client'

import React, {useState} from "react";
import {useDropzone} from "react-dropzone";
import {createMultipartUpload, uploadPart, completeMultipartUpload} from "@/server_actions/upload_s3";
import {PutItem, GetItem, UpdateItem} from "@/server_actions/dynamo_db";
import {ColorUpload, SuccessIcon, FailureIcon} from "@/components/icons"
import { Progress } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { update_ImgUploadStatus,
         update_PdfUploadStatus } from "@/redux/reduxfeat/manageformslice"


function chunkFile(file, chunkSize) {

    const chunks = [];
    let offset = 0;

    let partSize = file.size || file.byteLength || file.length;

    while (offset < partSize) {
        const chunk = file.slice(offset, offset + chunkSize);
        chunks.push(chunk);
        offset += chunkSize;
    }

    return chunks;

};

const GenerateTodayDatestring = () => {

    let today_date = new Date()
    let datestring = Number(`${today_date.getFullYear()}${(today_date.getMonth() + 1).toString().padStart(2, '0')}${today_date.getDate().toString().padStart(2, '0')}`);
    
    return datestring

  }

export function DropImage({form_data, all_valid_status}) {

    const [files, setFiles] = useState([]);
    const [imgUploadMessage, setImgUploadMessage] = useState({class: "", message: ""}); 
    const [progress, setProgress] = useState(0); 
    const dispatch = useDispatch()

  
    const {getRootProps, getInputProps} = useDropzone({
      multiple: false,
      onDrop: acceptedFiles => {
  
        acceptedFiles.forEach(file => {
  
          const reader = new FileReader();
    
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = async () => {
  
              try {
  
                const uint8Array = new Uint8Array(reader.result);
                const mimeType = file.type.replace('image/', '');
  
                if(!['jpeg', 'png', 'gif'].includes(mimeType)) {
  
                     setImgUploadMessage(
                      {class: "text-[#ff6666]",
                       message: (
                          <div className="w-full text-sm text-center flex flex-col items-center">
                            <p>Unsupported format, read the instructions below for image upload.</p>
                            <FailureIcon fill={"#ff9696"} size={60} />
                          </div>)}
                    );                  
  
                  return;
                  
                } else if (file.size > 2 * 1024 * 1024) { 
  
                  setImgUploadMessage(
                    {class: "text-[#ff6666]",
                     message: (
                        <div className="w-full text-sm text-center flex flex-col items-center">
                          <p>File size exceeds the maximum limit of 2MB</p>
                          <FailureIcon fill={"#ff9696"} size={60} />
                        </div>)}
                  );
  
                  return;
  
                } else if (!all_valid_status){
  
                  setImgUploadMessage(
                    {class: "text-[#ff6666]",
                     message: (
                        <div className="w-full text-sm text-center flex flex-col items-center">
                          <p>Please fill in all the above fields before proceeding with the image upload</p>
                          <FailureIcon fill={"#ff9696"} size={60} />
                        </div>)}
                  );
  
                  return;
  
                }
  
                const chunkSize = 5 * 1024 * 1024; // 2 MB chunks (min all size in s3 multipart is 3, increase server actions to 10mb)
                const chunks = chunkFile(uint8Array, chunkSize);
                const totalChunks = chunks.length;
                const parts = [];
                const key = `images/${form_data.car_id}.${mimeType}`;
              
                const uploadId = await createMultipartUpload(key);
              
                setProgress(0)
                for (let i = 0; i < totalChunks; i++) {
                  setProgress(Math.round((i + 1) / totalChunks * 100))
                  const part = await uploadPart(key, uploadId, i + 1, chunks[i]);
                  parts.push({ PartNumber: i + 1, ETag: part.ETag });
                };  
              
                await completeMultipartUpload(key, uploadId, parts);
                form_data.img_url = 'https://supercar.s3.eu-west-1.amazonaws.com/' + key;
                form_data.datestring = GenerateTodayDatestring()
  
                let put_item_response = await PutItem('cars', form_data);
  
                if(put_item_response) {
  
                  setImgUploadMessage({
  
                    class: "text-success",
                    message: (
                      <div className="w-full text-sm text-center flex flex-col items-center">
                        <p>Congratulations, you have uploaded the image of your supercar, and it has been added to 'Car space' as a draft.</p>
                        <p>Proceed with uploading the PDF and submit it.</p>
                        <SuccessIcon fill={"#a7f7a6"} size={60} />
                      </div>
                  )});
  
                  dispatch(update_ImgUploadStatus(true))
  
                } else {
  
                  setImgUploadMessage(
                    {class: "text-[#ff6666]",
                      message: (
                        <div className="w-full text-sm text-center flex flex-col items-center">
                          <p>Ops, something went wrong! Try again</p>
                          <FailureIcon fill={"#ff9696"} size={60} />
                        </div>)}
                  );  
  
                }
                
              } catch (error) {
                console.error('Error processing file:', error);
              }; 
            };
    
          reader.readAsArrayBuffer(file);
          
        });
  
          setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
          })));
  
      }
    });
    
    const thumbs = files.map(file => (
      <div className="inline-flex rounded-md border border-gray-400 mb-2 mr-2 w-100 h-100 p-2 box-border border-2 shadow-md" key={file.name}>
        <div className="flex w-36 overflow-hidden">
          <img
            src={file.preview}
            className="block w-auto h-full"
            onLoad={() => { URL.revokeObjectURL(file.preview) }}
          />
        </div>
      </div>
    ));
  
  
  
    return (
      <section className="w-full bg-primary p-2 rounded-xl shadow-md">
        <div {...getRootProps({className: 'flex flex-col items-center w-full bg-white p-3 rounded-md border-1 border-gray-300'})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop your Supercar picture here.</p>
            <p>Or click to select files</p>
            <ColorUpload size={60}/>
            <div className="w-full mt-1">
              {progress ? <Progress color="success" aria-label="Loading..." value={progress} /> : null}
            </div>
            <div className={`mt-2 w-full ${imgUploadMessage.class}`}> 
              {imgUploadMessage.message}
            </div>
        </div>
        <div className="text-xs text-white">
          <p className="my-3">Accepted file formats: .jpg, .png, or .gif. The maximum allowed size is 2MB.</p>
        </div>
        <aside className="flex flex-row flex-wrap mt-3">
          {thumbs}
        </aside>
      </section>
    );
  };
  
  

  
export function DropPdf({form_data}) {

    const [pdfUploadMessage, setPdfUploadMessage] = useState({class: "", message: ""}); 
    const [progress, setProgress] = useState(0); 
    const dispatch = useDispatch()
  
    const {getRootProps, getInputProps} = useDropzone({
      multiple: false,
      onDrop: acceptedFiles => {
  
        acceptedFiles.forEach(file => {
  
          const reader = new FileReader();
    
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = async () => {
  
              try {
  
                const uint8Array = new Uint8Array(reader.result);
                const mimeType = file.type.replace('application/', '');
  
                const car_item = await GetItem("cars", "car_id", form_data.car_id)
               
                if(!car_item) {
  
                  setPdfUploadMessage(
                    {class: "text-[#ff6666]",
                      message: (
                        <div className="w-full text-sm text-center flex flex-col items-center">
                          <p>Please ensure you complete all the previous steps.</p>
                          <p>Fill out the requested fields and upload the car picture first,</p>
                          <p>and then upload the supercar specs PDF file</p>
                          <FailureIcon fill={"#ff9696"} size={60} />
                        </div>)}
                  );  
  
                  return;                
                  
                } else if (!['pdf'].includes(mimeType)) {
  
                  setPdfUploadMessage(
                    {class: "text-[#ff6666]",
                      message: (
                        <div className="w-full text-sm text-center flex flex-col items-center">
                          <p>Unsupported format, please upload a pdf file.</p>
                          <FailureIcon fill={"#ff9696"} size={60} />
                        </div>)}
                  );  
  
                  return;
                  
                } else if (file.size > 40 * 1024 * 1024) { 
  
                  setPdfUploadMessage(
                    {class: "text-[#ff6666]",
                      message: (
                        <div className="w-full text-sm text-center flex flex-col items-center">
                          <p>File size exceeds the maximum limit of 40MB.</p>
                          <FailureIcon fill={"#ff9696"} size={60} />
                        </div>)}
                  );  
  
                  return;
                } 
         
                const chunkSize = 5 * 1024 * 1024; 
                const chunks = chunkFile(uint8Array, chunkSize);
                const totalChunks = chunks.length;
                const parts = [];
                const key = `pdf/${form_data.car_id}.${mimeType}`
  
                const uploadId = await createMultipartUpload(key);
  
                setProgress(0)
  
                for (let i = 0; i < totalChunks; i++) {
                  setProgress(Math.round((i + 1) / totalChunks * 100))
                  const part = await uploadPart(key, uploadId, i + 1, chunks[i]);
                  parts.push({ PartNumber: i + 1, ETag: part.ETag });
                }  
              
                await completeMultipartUpload(key, uploadId, parts);
                const pdf_url = 'https://supercar.s3.eu-west-1.amazonaws.com/' + key;
  
                let update_item_response = await UpdateItem("cars", "car_id", form_data.car_id, ["pdf_url"], [pdf_url])
  
                if(update_item_response) {
  
                  setPdfUploadMessage({
                    class: "text-success",
                    message: (
                      <div className="w-full text-sm text-center flex flex-col items-center">
                        <p>Congratulations on successfully uploading the supercar specs PDF file.</p>
                        <p>Now choose your Ad options and publish your supercar.</p>
                        <SuccessIcon fill={"#a7f7a6"} size={60} />
                      </div>
                  )});
  
                  dispatch(update_PdfUploadStatus(true))
  
                } else {
                
                  setPdfUploadMessage(
                    {class: "text-[#ff6666]",
                      message: (
                        <div className="w-full text-sm text-center flex flex-col items-center">
                          <p>Ops, something went wrong! Try again</p>
                          <FailureIcon fill={"#ff9696"} size={60} />
                        </div>)}
                  );  
                };
  
              } catch (error) {
                console.error('Error processing file:', error);
              } 
              
            };
    
          reader.readAsArrayBuffer(file);
          
        });
        }
      });
        
    
      return (
        <section className="w-full bg-primary p-2 rounded-xl shadow-md">
          <div {...getRootProps({className: 'flex flex-col items-center w-full bg-[white] p-3 rounded-md border-1 border-gray-300'})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop your supercar specs PDF format.</p>
            <p>Or click to select files</p>
            <ColorUpload size={60}/>
            <div className="w-full mt-1">
              {progress ? <Progress color="success" aria-label="Loading..." value={progress} /> : null}
            </div>
            <div className={`mt-2 w-full ${pdfUploadMessage.class}`}> 
              {pdfUploadMessage.message}
            </div>
          </div>
          <div className="text-xs text-white">
            <p className="my-3">
              Rest assured, the file will be securely encrypted. The maximum allowed size is 40MB.
            </p>
          </div>
        </section>
      );
    }
    
    