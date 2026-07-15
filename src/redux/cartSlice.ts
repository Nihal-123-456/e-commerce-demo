import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
    _id?: mongoose.Types.ObjectId | string,
    name: string,
    category: string,
    price: string,
    unit: string,
    quantity: number,
    image: string,
    createdAt?: Date,
    updatedAt?: Date
}

interface ICartSlice{
    cartData: IGrocery[],
    subTotal: number,
    deliveryFee: number,
    finalTotal: number
}

const initialState:ICartSlice = {
    cartData: [],
    subTotal: 0,
    deliveryFee: 50,
    finalTotal: 50
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action:PayloadAction<IGrocery>) => {
            state.cartData.push(action.payload)
            cartSlice.caseReducers.calculateTotal(state)
        },
        increaseQuantity: (state, action:PayloadAction<mongoose.Types.ObjectId | string>) => {
            const payloadId = action.payload.toString()
            const item = state.cartData.find(i=>i._id?.toString() === payloadId)
            if(item) {
                item.quantity += 1
            }
            cartSlice.caseReducers.calculateTotal(state)
        },
        decreaseQuantity: (state, action:PayloadAction<mongoose.Types.ObjectId | string>) => {
            const payloadId = action.payload.toString()
            const item = state.cartData.find(i=>i._id?.toString() === payloadId)
            if(item?.quantity && item.quantity > 1) {
                item.quantity -= 1
            } else {
                state.cartData = state.cartData.filter(i=>i._id?.toString() !== payloadId)
            }
            cartSlice.caseReducers.calculateTotal(state)
        },
        removeFromCart: (state, action:PayloadAction<mongoose.Types.ObjectId | string>) => {
            const payloadId = action.payload.toString()
            state.cartData = state.cartData.filter(i=>i._id?.toString() !== payloadId)
            cartSlice.caseReducers.calculateTotal(state)
        },
        calculateTotal: (state) => {
            state.subTotal = state.cartData.reduce((sum, item) =>sum + (Number(item.price) * item.quantity),0 )
            state.deliveryFee = state.subTotal > 500 ? 0 : 50
            state.finalTotal = state.subTotal + state.deliveryFee
        }  
    }
})

export const {addToCart, increaseQuantity, decreaseQuantity, removeFromCart, calculateTotal}=cartSlice.actions
export default cartSlice.reducer