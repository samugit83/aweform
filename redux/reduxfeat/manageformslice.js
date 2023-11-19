import { createSlice } from '@reduxjs/toolkit'

export const manageformSlice = createSlice({
    name: 'manageform',
    initialState: {
        ImgUploadStatus: false,
        PdfUploadStatus: false,
        Publishtime: '3',
        Sponsored: false,
        Sponstype: false,
        DefaultCost: 1500,
        TotalCost: 0,
        LiveCarsList: []
    },
    reducers: {
      update_Publishtime: (state, action) => {
        state.Publishtime = action.payload
      },
      update_Sponsored: (state, action) => {
        state.Sponsored = action.payload
      },
      update_Sponstype: (state, action) => {
          state.Sponstype = action.payload
      },
      update_TotalCost: (state, action) => {
        state.TotalCost = action.payload
      },
      update_ImgUploadStatus: (state, action) => {
        state.ImgUploadStatus = action.payload
      },
      update_PdfUploadStatus: (state, action) => {
        state.PdfUploadStatus = action.payload
      },
      update_LiveCarsList: (state, action) => {
        state.LiveCarsList = action.payload
      }
    }
 }
)

export const {
  update_Publishtime,
  update_Sponsored,
  update_Sponstype,
  update_TotalCost,
  update_ImgUploadStatus,
  update_PdfUploadStatus,
  update_LiveCarsList
} = manageformSlice.actions

export default manageformSlice.reducer